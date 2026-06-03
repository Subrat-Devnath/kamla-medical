package com.user.mgmt.repository.dao;

import com.user.mgmt.repository.entity.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RolesDao extends JpaRepository<RolesEntity, String> {

    RolesEntity findByName(String roleName);

}

