package com.user.mgmt.service.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.dtos.LoginRequest;
import com.common.service.dtos.ResponseDTO;
import com.email.client.EmailClient;
import com.email.client.dtos.NotificationDTO;
import com.security.client.dtos.SourceIdentity;
import com.security.config.service.impl.WebSecurityConfig;
import com.security.config.utils.SecurityUtil;
import com.user.mgmt.client.dtos.*;
import com.user.mgmt.client.enums.RoleType;
import com.user.mgmt.repository.OrganizationRepository;
import com.user.mgmt.repository.PasswordResetOtpRepository;
import com.user.mgmt.repository.RolesRepository;
import com.user.mgmt.repository.UserRepository;
import com.user.mgmt.repository.entity.OrganizationEntity;
import com.user.mgmt.repository.entity.PasswordResetOtpEntity;
import com.user.mgmt.repository.entity.RolesEntity;
import com.user.mgmt.repository.entity.UserEntity;
import com.user.mgmt.repository.enums.OrgProfile;
import com.user.mgmt.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private WebSecurityConfig webSecurityConfig;

    @Autowired
    private PasswordResetOtpRepository passwordResetOtpRepository;

    @Autowired
    private EmailClient emailClient;

    @Override
    public ResponseDTO addUser(UserDTO userDto) {

        UserEntity existingUser = userRepository.getUserByUserName(userDto.getName());

        if (existingUser != null) {
            return new ResponseDTO(false, null, "User already exists");
        }

        try {
            String userSalt = UUID.randomUUID().toString();
            userDto.setPasswordSecret(userSalt);

            String encryptedPassword = webSecurityConfig.passwordEncoder().encode(userDto.getPassword());

            userDto.setPassword(encryptedPassword);
        } catch (Exception e) {
            return new ResponseDTO(false, null, e.getMessage());
        }

        userDto.setActive(true);
        userDto.setDeleted(false);
        userDto.setRetryCount(0);

        UserEntity userEntity = ObjectBuilder.buildDtoFromEntity(userDto, null, UserEntity.class);

        RolesEntity rolesEntity = rolesRepository.getRoleByName(RoleType.USER.name());

        if (rolesEntity == null) {
            return new ResponseDTO(false, null, "Role not found for user");
        }

        userEntity.setRoles(Set.of(rolesEntity));

        OrganizationEntity organizationEntity = organizationRepository.getOrganizationByName(userDto.getCompanyName().trim().toUpperCase());

        if (organizationEntity != null) {

            userEntity.setOrganization(organizationEntity);
            userRepository.addUser(userEntity);
            return new ResponseDTO(true, null, null);
        }

        OrganizationEntity newOrganizationEntity = new OrganizationEntity();
        newOrganizationEntity.setId(UUID.randomUUID().toString());
        newOrganizationEntity.setName(userDto.getCompanyName().trim().toUpperCase());
        newOrganizationEntity.setCity(userEntity.getCity());
        newOrganizationEntity.setDeleted(false);
        newOrganizationEntity.setEnabled(true);
        newOrganizationEntity.setOrgProfile(OrgProfile.RESELLER);
        newOrganizationEntity.setTestOrg(false);

        organizationRepository.insertOrganization(newOrganizationEntity);

        userEntity.setOrganization(newOrganizationEntity);

        userRepository.addUser(userEntity);

        return new ResponseDTO(true, null, null);

    }

    @Override
    public UserDTO getUserById(String id) {
        UserEntity userById = userRepository.getUserById(id);
        if (userById == null) {
            return null;
        }
        return ObjectBuilder.buildDtoFromEntity(userById, null, UserDTO.class);
    }

    @Override
    public UserDTO getUserByUserName(String userName) {

        if (!StringUtils.hasText(userName)) {
            return null;
        }

        UserEntity userEntity = userRepository.getUserByUserName(userName);

        if (userEntity == null) {
            return null;
        }

        return ObjectBuilder.buildDtoFromEntity(userEntity, null, UserDTO.class);
    }

    @Override
    public UserDTO validateUserAndGet(LoginRequest loginRequest) {

        UserDTO userByUserName = getUserByUserName(loginRequest.getUserName());

        if (userByUserName == null) {
            logger.info("User not found for username: {}", loginRequest.getUserName());
            return null;
        }

        if (!userByUserName.isActive()) {
            logger.info("User is active for username: {}", loginRequest.getUserName());
            return null;
        }

        // Stored hashed password from DB
        String storedPasswordHash = userByUserName.getPassword();

        // Correct comparison
        boolean match = webSecurityConfig.passwordEncoder().matches(loginRequest.getPassword(), storedPasswordHash);

        if (match) {
            return userByUserName;
        }

        logger.info("Password mismatch for username: {}", loginRequest.getUserName());

        return null;
    }

    @Override
    public ResponseDTO updatePassword(UpdatePasswordRequest updatePasswordRequest) {
        // Validate inputs
        if (!StringUtils.hasText(updatePasswordRequest.getEmailId())) {
            return new ResponseDTO(false, null, "Email ID is required");
        }

        if (!StringUtils.hasText(updatePasswordRequest.getOldPassword())) {
            return new ResponseDTO(false, null, "Old password is required");
        }

        if (!StringUtils.hasText(updatePasswordRequest.getNewPassword())) {
            return new ResponseDTO(false, null, "New password is required");
        }

        try {
            // Get user by email
            UserEntity userEntity = userRepository.getUserByUserName(updatePasswordRequest.getEmailId());

            if (userEntity == null) {
                return new ResponseDTO(false, null, "User not found with provided email ID");
            }

            // Verify old password matches
            boolean passwordMatch = webSecurityConfig.passwordEncoder().matches(updatePasswordRequest.getOldPassword(), userEntity.getPassword());

            if (!passwordMatch) {
                return new ResponseDTO(false, null, "Old password is incorrect");
            }

            // Check if new password is same as old password
            boolean isSamePassword = webSecurityConfig.passwordEncoder().matches(updatePasswordRequest.getNewPassword(), userEntity.getPassword());

            if (isSamePassword) {
                return new ResponseDTO(false, null, "New password cannot be same as old password");
            }

            // Encrypt and update new password
            String encryptedPassword = webSecurityConfig.passwordEncoder().encode(updatePasswordRequest.getNewPassword());
            userEntity.setPassword(encryptedPassword);
            userRepository.addUser(userEntity);

            return new ResponseDTO(true, null, "Password updated successfully");
        } catch (Exception e) {
            return new ResponseDTO(false, null, "Error updating password: " + e.getMessage());
        }
    }

    @Override
    public ResponseDTO sendForgotPasswordOtp(ForgotPasswordOtpRequest forgotPasswordOtpRequest) {
        if (!StringUtils.hasText(forgotPasswordOtpRequest.getEmailId())) {
            return new ResponseDTO(false, null, "Email ID is required");
        }

        try {
            // Get user by email
            UserEntity userEntity = userRepository.getUserByUserName(forgotPasswordOtpRequest.getEmailId());

            if (userEntity == null) {
                return new ResponseDTO(false, null, "User not found with provided email ID");
            }

            // Generate 6-digit OTP
            String otp = generateOtp();

            // Create OTP entity with expiry (10 minutes)
            PasswordResetOtpEntity otpEntity = new PasswordResetOtpEntity(userEntity, otp, LocalDateTime.now().plusMinutes(3));

            // Save OTP to database
            passwordResetOtpRepository.saveOtp(otpEntity);

            // Send OTP via email
            try {
                sendOtpEmail(userEntity.getEmailId(), userEntity.getName(), otp);
            } catch (Exception e) {
                // OTP is saved but email failed
                return new ResponseDTO(false, null, "OTP generated but failed to send email: " + e.getMessage());
            }

            return new ResponseDTO(true, null, "OTP sent successfully to your email");
        } catch (Exception e) {
            return new ResponseDTO(false, null, "Error sending OTP: " + e.getMessage());
        }
    }

    @Override
    public ResponseDTO verifyOtp(VerifyOtpRequest verifyOtpRequest) {
        if (!StringUtils.hasText(verifyOtpRequest.getEmailId())) {
            return new ResponseDTO(false, null, "Email ID is required");
        }

        if (!StringUtils.hasText(verifyOtpRequest.getOtp())) {
            return new ResponseDTO(false, null, "OTP is required");
        }

        try {
            // Get user by email
            UserEntity userEntity = userRepository.getUserByUserName(verifyOtpRequest.getEmailId());

            if (userEntity == null) {
                return new ResponseDTO(false, null, "User not found with provided email ID");
            }

            // Get OTP from database
            PasswordResetOtpEntity otpEntity = passwordResetOtpRepository.getOtpByOtpAndUserId(verifyOtpRequest.getOtp(), userEntity.getId());

            if (otpEntity == null) {
                return new ResponseDTO(false, null, "Invalid OTP");
            }

            // Check if OTP is already verified
            if (otpEntity.isVerified()) {
                return new ResponseDTO(false, null, "OTP has already been verified");
            }

            // Check if OTP has expired
            if (LocalDateTime.now().isAfter(otpEntity.getExpiryDate())) {
                return new ResponseDTO(false, null, "OTP has expired");
            }

            // Mark OTP as verified
            otpEntity.setVerified(true);
            passwordResetOtpRepository.updateOtp(otpEntity);

            return new ResponseDTO(true, null, "OTP verified successfully");
        } catch (Exception e) {
            return new ResponseDTO(false, null, "Error verifying OTP: " + e.getMessage());
        }
    }

    @Override
    public ResponseDTO resetPasswordWithOtp(ResetPasswordWithOtpRequest resetPasswordWithOtpRequest) {
        if (!StringUtils.hasText(resetPasswordWithOtpRequest.getEmailId())) {
            return new ResponseDTO(false, null, "Email ID is required");
        }

        if (!StringUtils.hasText(resetPasswordWithOtpRequest.getOtp())) {
            return new ResponseDTO(false, null, "OTP is required");
        }

        if (!StringUtils.hasText(resetPasswordWithOtpRequest.getNewPassword())) {
            return new ResponseDTO(false, null, "New password is required");
        }

        try {
            // Get user by email
            UserEntity userEntity = userRepository.getUserByUserName(resetPasswordWithOtpRequest.getEmailId());

            if (userEntity == null) {
                return new ResponseDTO(false, null, "User not found with provided email ID");
            }

            // Verify OTP
            PasswordResetOtpEntity otpEntity = passwordResetOtpRepository.getOtpByOtpAndUserId(resetPasswordWithOtpRequest.getOtp(), userEntity.getId());

            if (otpEntity == null) {
                return new ResponseDTO(false, null, "Invalid OTP");
            }

            // Check if OTP is verified
            if (!otpEntity.isVerified()) {
                return new ResponseDTO(false, null, "OTP has not been verified");
            }

            // Check if OTP has expired
            if (LocalDateTime.now().isAfter(otpEntity.getExpiryDate())) {
                return new ResponseDTO(false, null, "OTP has expired");
            }

            // Update password
            String encryptedPassword = webSecurityConfig.passwordEncoder().encode(resetPasswordWithOtpRequest.getNewPassword());
            userEntity.setPassword(encryptedPassword);
            userRepository.addUser(userEntity);

            return new ResponseDTO(true, null, "Password reset successfully");
        } catch (Exception e) {
            return new ResponseDTO(false, null, "Error resetting password: " + e.getMessage());
        }
    }

    // Helper method to generate OTP
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // Helper method to send OTP via email
    private void sendOtpEmail(String toEmail, String userName, String otp) throws Exception {
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setTo(toEmail);
        notificationDTO.setSubject("Password Reset OTP");
        notificationDTO.setMessage("<html><body>" + "<h2>Password Reset Request</h2>" + "<p>Dear " + userName + ",</p>" + "<p>You have requested to reset your password. Please use the following OTP to proceed:</p>" + "<h1 style='color: #0066cc;'>" + otp + "</h1>" + "<p>This OTP is valid for 3 minutes.</p>" + "<p>If you did not request this, please ignore this email.</p>" + "<p>Best regards,<br>Kamla Medical Team</p>" + "</body></html>");
        notificationDTO.setHtml(true);
        notificationDTO.setFrom("noreply@kamla-medical.com");

        emailClient.sendEmailWithAttachment(notificationDTO);
    }

}
