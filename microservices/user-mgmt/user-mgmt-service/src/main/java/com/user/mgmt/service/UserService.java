package com.user.mgmt.service;

import com.common.service.dtos.LoginRequest;
import com.common.service.dtos.ResponseDTO;
import com.user.mgmt.client.dtos.ForgotPasswordOtpRequest;
import com.user.mgmt.client.dtos.ResetPasswordWithOtpRequest;
import com.user.mgmt.client.dtos.UpdatePasswordRequest;
import com.user.mgmt.client.dtos.VerifyOtpRequest;
import com.user.mgmt.client.dtos.UserDTO;

public interface UserService {

    ResponseDTO addUser(UserDTO userDto);

    UserDTO getUserById(String id);

    UserDTO getUserByUserName(String userName);

    UserDTO validateUserAndGet(LoginRequest uerDetails);

    ResponseDTO updatePassword(UpdatePasswordRequest updatePasswordRequest);

    ResponseDTO sendForgotPasswordOtp(ForgotPasswordOtpRequest forgotPasswordOtpRequest);

    ResponseDTO verifyOtp(VerifyOtpRequest verifyOtpRequest);

    ResponseDTO resetPasswordWithOtp(ResetPasswordWithOtpRequest resetPasswordWithOtpRequest);

}
