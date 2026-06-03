package com.user.mgmt.repository.dao;

import com.user.mgmt.repository.entity.OrganizationEntity;
import com.user.mgmt.repository.entity.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationDao extends JpaRepository<OrganizationEntity, String> {

    OrganizationEntity findByName(String organizationName);

}
