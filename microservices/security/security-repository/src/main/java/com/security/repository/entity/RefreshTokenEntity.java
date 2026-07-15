package com.security.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "refresh_token")
public class RefreshTokenEntity {

    @Id
    @Column(name = "token_id", length = 36)
    private UUID tokenId;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "created_at")
    private Integer createdAt;

    @Column(name = "expired_at")
    private Integer expiresAt;

    @Column(name = "revoked")
    private boolean revoked;

    @Column(name = "replaced_token", length = 1024)
    private String replacedToken;

}
