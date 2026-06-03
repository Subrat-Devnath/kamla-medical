package com.security.repository.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Builder
@Data
@Table("refresh_token")
public class RefreshTokenEntity {

    @PrimaryKeyColumn(name = "token_id", type = PrimaryKeyType.PARTITIONED)
    private UUID tokenId;

    @Column("user_id")
    private String userId;

    @Column("created_at")
    private Integer createdAt;

    @Column("expired_at")
    private Integer expiresAt;

    @Column("revoked")
    private boolean revoked;

    @Column("replaced_token")
    private String replacedToken;

}
