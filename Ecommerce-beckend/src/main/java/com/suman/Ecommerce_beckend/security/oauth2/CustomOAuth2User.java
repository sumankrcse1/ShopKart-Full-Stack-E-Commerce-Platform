package com.suman.Ecommerce_beckend.security.oauth2;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private OAuth2User oauth2User;
    private String email;
    private String name;
    private String providerId;

    public CustomOAuth2User(OAuth2User oauth2User, String email, String name, String providerId) {
        this.oauth2User = oauth2User;
        this.email = email;
        this.name = name;
        this.providerId = providerId;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getProviderId() {
        return providerId;
    }
}