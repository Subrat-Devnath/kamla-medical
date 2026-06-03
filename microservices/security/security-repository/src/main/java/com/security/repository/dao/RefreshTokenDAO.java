package com.security.repository.dao;

import com.security.repository.entity.RefreshTokenEntity;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

import java.util.UUID;

public interface RefreshTokenDAO extends CassandraRepository<RefreshTokenEntity, UUID> {

    @Query("select * from refresh_token where token_id = ?0")
    RefreshTokenEntity getRefreshToken(UUID tokenId);
}
