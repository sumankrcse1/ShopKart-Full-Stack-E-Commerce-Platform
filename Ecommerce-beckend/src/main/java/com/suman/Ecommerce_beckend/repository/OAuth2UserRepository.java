package com.suman.Ecommerce_beckend.repository;

import com.suman.Ecommerce_beckend.model.AuthProvider;
import com.suman.Ecommerce_beckend.model.OAuth2UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuth2UserRepository extends JpaRepository<OAuth2UserInfo, Long> {

    Optional<OAuth2UserInfo> findByEmail(String email);

    Optional<OAuth2UserInfo> findByProviderAndProviderId(AuthProvider provider, String providerId);

    Boolean existsByEmail(String email);
}