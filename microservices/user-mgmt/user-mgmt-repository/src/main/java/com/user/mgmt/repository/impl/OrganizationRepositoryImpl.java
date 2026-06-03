package com.user.mgmt.repository.impl;

import com.user.mgmt.repository.OrganizationRepository;
import com.user.mgmt.repository.dao.OrganizationDao;
import com.user.mgmt.repository.entity.OrganizationEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationRepositoryImpl implements OrganizationRepository {

    @Autowired
    private OrganizationDao organizationDao;

    @Override
    public OrganizationEntity getOrganizationByName(String organizationName) {
        return organizationDao.findByName(organizationName);
    }

    @Override
    public void insertOrganization(OrganizationEntity organizationEntity) {
        organizationDao.save(organizationEntity);
    }
}
