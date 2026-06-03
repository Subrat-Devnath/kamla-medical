package com.user.mgmt.repository;

import com.user.mgmt.repository.entity.OrganizationEntity;

public interface OrganizationRepository {

    OrganizationEntity getOrganizationByName(String organizationName);

    void insertOrganization(OrganizationEntity organizationEntity);
}
