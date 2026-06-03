package com.security.repository.impl;

import com.security.repository.RefreshTokenRepository;
import com.security.repository.dao.RefreshTokenDAO;
import com.security.repository.entity.RefreshTokenEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RefreshTokenRepositoryImpl implements RefreshTokenRepository {

    @Autowired
    private RefreshTokenDAO refreshTokenDAO;

    @Override
    public void saveRefreshToken(RefreshTokenEntity refreshTokenEntity) {
        refreshTokenDAO.save(refreshTokenEntity);
    }
}
