package com.user.mgmt.repository.dao;

import com.user.mgmt.repository.entity.PasswordResetOtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetOtpDao extends JpaRepository<PasswordResetOtpEntity, String> {

    PasswordResetOtpEntity findByUserIdOrderByCreatedDateDesc(String userId);

    PasswordResetOtpEntity findByOtpAndUserId(String otp, String userId);
}

