package com.user.mgmt.repository;

import com.user.mgmt.repository.entity.RolesEntity;

public interface RolesRepository {

    RolesEntity getRoleByName(String roleName);

}
