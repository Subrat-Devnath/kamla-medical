package com.user.mgmt.repository.impl;

import com.user.mgmt.repository.UserRepository;
import com.user.mgmt.repository.dao.UserDao;
import com.user.mgmt.repository.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserRepositoryServiceImpl implements UserRepository {

    @Autowired
    private UserDao userDao;

    @Override
    public void addUser(UserEntity userEntity) {
        userEntity.setActive(true);
        userEntity.setLastLoginDate(System.currentTimeMillis());
        userDao.save(userEntity);
    }

    @Override
    public UserEntity getUserById(String id) {
        Optional<UserEntity> userEntity = userDao.findById(id);
        boolean present = userEntity.isPresent();
        if (!present) {
            return null;
        }
        return userEntity.get();
    }

    @Override
    public UserEntity getUserByUserName(String userName) {
        return userDao.findByName(userName);
    }

}
