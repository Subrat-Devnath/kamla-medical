package com.user.mgmt.repository;

import com.user.mgmt.repository.entity.UserEntity;

public interface UserRepository {

	void addUser(UserEntity userEntity);

	UserEntity getUserById(String id);

	UserEntity getUserByUserName(String userName);

}
