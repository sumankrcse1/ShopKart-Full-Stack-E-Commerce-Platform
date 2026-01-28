package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService{
    public User findUserById(Long userId) throws UserException;

    public User findUserProfileByJwt(String jwt) throws UserException;

    User createUser(User user);

    User findUserByEmail(String email);

    void updateUserPassword(User user, String newPassword);
}
