package com.user.mgmt.repository.impl;

import com.user.mgmt.repository.RolesRepository;
import com.user.mgmt.repository.dao.RolesDao;
import com.user.mgmt.repository.entity.RolesEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RolesRepositoryImpl implements RolesRepository {

    @Autowired
    private RolesDao rolesDao;

    @Override
    public RolesEntity
    getRoleByName(String roleName) {
        return rolesDao.findByName(roleName);
    }
}
