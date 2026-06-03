package com.security.repository.dao;

import com.security.repository.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface RefreshTokenDAO extends JpaRepository<RefreshTokenEntity, UUID> {

    @Query("SELECT r FROM RefreshTokenEntity r WHERE r.tokenId = :tokenId")
    RefreshTokenEntity getRefreshToken(@Param("tokenId") UUID tokenId);
}
