package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.config.JwtProvider;
import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImplementation implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;


    @Override
    public User findUserById(Long userId) throws UserException {
        Optional<User> user=userRepository.findById(userId);

        if(user.isPresent()){
            return user.get();
        }
        throw new UserException("user not found with id "+userId);
    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7).trim();
        }

        String email = jwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new UserException("user not exist with email " + email);
        }
        return user;
    }

    @Override
    public User createUser(User user) {
        // Check if this is the admin email and assign ADMIN role
        if (user.getEmail() != null && user.getEmail().equalsIgnoreCase(adminEmail)) {
            user.setRole("ADMIN");
        } else {
            user.setRole("CUSTOMER");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void updateUserPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
