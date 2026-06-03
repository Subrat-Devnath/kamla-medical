package com.user.mgmt.repository;

import com.user.mgmt.repository.entity.PasswordResetOtpEntity;

public interface PasswordResetOtpRepository {

    void saveOtp(PasswordResetOtpEntity otpEntity);

    PasswordResetOtpEntity getOtpByUserId(String userId);

    PasswordResetOtpEntity getOtpByOtpAndUserId(String otp, String userId);

    void updateOtp(PasswordResetOtpEntity otpEntity);
}

