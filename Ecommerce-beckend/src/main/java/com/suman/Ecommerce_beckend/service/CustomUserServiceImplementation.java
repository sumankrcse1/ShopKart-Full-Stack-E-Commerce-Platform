package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserServiceImplementation implements UserDetailsService {

    private UserRepository userRepository;

    public CustomUserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findByEmail(username);
        if (user==null){
            throw new UsernameNotFoundException("user not found with email-"+username);
        }

        List<GrantedAuthority> authorities=new ArrayList<>();
        // Add role with ROLE_ prefix
        String role = user.getRole();
        if (role == null || role.isEmpty()) {
            role = "CUSTOMER";
        }

        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        authorities.add(new SimpleGrantedAuthority(role));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
