package com.suman.Ecommerce_beckend.security.oauth2;

import com.suman.Ecommerce_beckend.model.AuthProvider;
import com.suman.Ecommerce_beckend.model.OAuth2UserInfo;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.OAuth2UserRepository;
import com.suman.Ecommerce_beckend.repository.UserRepository;
import com.suman.Ecommerce_beckend.security.oauth2.OAuth2UserInfoExtractor.OAuth2UserInfoDTO;
import com.suman.Ecommerce_beckend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OAuth2UserRepository oauth2UserRepository;

    @Autowired
    private CartService cartService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // Get user attributes
        Map<String, Object> attributes = oauth2User.getAttributes();

        OAuth2UserInfoDTO userInfoDTO = OAuth2UserInfoExtractor.extractUserInfo(
                registrationId,
                attributes
        );

        if (userInfoDTO.getEmail() == null || userInfoDTO.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("email_not_found"),
                    "Email not found from OAuth2 provider"
            );
        }

        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
        processOAuth2User(userInfoDTO, provider);

        return new CustomOAuth2User(
                oauth2User,
                userInfoDTO.getEmail(),
                userInfoDTO.getName(),
                userInfoDTO.getProviderId()
        );
    }

    @Transactional
    public void processOAuth2User(OAuth2UserInfoDTO userInfoDTO, AuthProvider provider) {
        Optional<OAuth2UserInfo> existingOAuth2User = oauth2UserRepository
                .findByProviderAndProviderId(provider, userInfoDTO.getProviderId());

        if (existingOAuth2User.isPresent()) {
            // Update existing OAuth2 user
            OAuth2UserInfo oauth2UserInfo = existingOAuth2User.get();
            oauth2UserInfo.setName(userInfoDTO.getName());
            oauth2UserInfo.setImageUrl(userInfoDTO.getImageUrl());
            oauth2UserInfo.setUpdatedAt(LocalDateTime.now());
            oauth2UserRepository.save(oauth2UserInfo);
        } else {
            // Create new OAuth2 user
            User user = userRepository.findByEmail(userInfoDTO.getEmail());

            if (user == null) {
                // Create new user account
                user = new User();
                user.setEmail(userInfoDTO.getEmail());
                user.setFirstName(userInfoDTO.getGivenName() != null ? userInfoDTO.getGivenName() : "");
                user.setLastName(userInfoDTO.getFamilyName() != null ? userInfoDTO.getFamilyName() : "");
                user.setRole("CUSTOMER");
                user.setPassword(""); // OAuth users don't have passwords
                user.setCreatedAt(LocalDateTime.now());
                user = userRepository.save(user);

                // Create cart for new user
                cartService.createCart(user);
            }

            // Create OAuth2 user info
            OAuth2UserInfo oauth2UserInfo = new OAuth2UserInfo(
                    userInfoDTO.getEmail(),
                    userInfoDTO.getName(),
                    userInfoDTO.getProviderId(),
                    provider,
                    userInfoDTO.getImageUrl()
            );
            oauth2UserInfo.setUser(user);
            oauth2UserRepository.save(oauth2UserInfo);
        }
    }
}