package com.security.repository.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.UUID;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "refresh_token")
public class RefreshTokenEntity {

    @Id
    @Column(name = "token_id")
    private UUID tokenId;

    @Column(name = "user_id", nullable = false, length = 255)
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
