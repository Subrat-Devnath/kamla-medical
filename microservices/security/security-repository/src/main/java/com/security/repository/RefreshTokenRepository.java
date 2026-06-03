package com.security.repository;

import com.security.repository.entity.RefreshTokenEntity;

public interface RefreshTokenRepository {
    void saveRefreshToken(RefreshTokenEntity refreshTokenEntity);
}
