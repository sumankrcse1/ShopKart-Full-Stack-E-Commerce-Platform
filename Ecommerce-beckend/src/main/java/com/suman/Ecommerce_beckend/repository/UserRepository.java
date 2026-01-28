package com.suman.Ecommerce_beckend.repository;

import com.suman.Ecommerce_beckend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

    public User findByEmail(String email);
}
