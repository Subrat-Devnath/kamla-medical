package com.user.mgmt.repository.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "password_reset_otp")
public class PasswordResetOtpEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", nullable = false)
    private String id;

    @ManyToOne(targetEntity = UserEntity.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private UserEntity user;

    @Column(name = "otp", nullable = false)
    private String otp;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "is_verified")
    private boolean isVerified;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    public PasswordResetOtpEntity() {
    }

    public PasswordResetOtpEntity(UserEntity user, String otp, LocalDateTime expiryDate) {
        this.user = user;
        this.otp = otp;
        this.expiryDate = expiryDate;
        this.isVerified = false;
        this.createdDate = LocalDateTime.now();
    }
}

