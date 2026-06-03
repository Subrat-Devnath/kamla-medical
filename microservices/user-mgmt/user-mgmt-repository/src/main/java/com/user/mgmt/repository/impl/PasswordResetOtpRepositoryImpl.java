package com.user.mgmt.repository.impl;

import com.user.mgmt.repository.PasswordResetOtpRepository;
import com.user.mgmt.repository.dao.PasswordResetOtpDao;
import com.user.mgmt.repository.entity.PasswordResetOtpEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetOtpRepositoryImpl implements PasswordResetOtpRepository {

    @Autowired
    private PasswordResetOtpDao passwordResetOtpDao;

    @Override
    public void saveOtp(PasswordResetOtpEntity otpEntity) {
        passwordResetOtpDao.save(otpEntity);
    }

    @Override
    public PasswordResetOtpEntity getOtpByUserId(String userId) {
        return passwordResetOtpDao.findByUserIdOrderByCreatedDateDesc(userId);
    }

    @Override
    public PasswordResetOtpEntity getOtpByOtpAndUserId(String otp, String userId) {
        return passwordResetOtpDao.findByOtpAndUserId(otp, userId);
    }

    @Override
    public void updateOtp(PasswordResetOtpEntity otpEntity) {
        passwordResetOtpDao.save(otpEntity);
    }
}

