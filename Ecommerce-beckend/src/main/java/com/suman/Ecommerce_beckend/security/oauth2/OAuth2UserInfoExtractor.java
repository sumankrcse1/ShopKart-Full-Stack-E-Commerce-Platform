package com.suman.Ecommerce_beckend.security.oauth2;

import java.util.Map;

public class OAuth2UserInfoExtractor {

    public static OAuth2UserInfoDTO extractUserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase("google")) {
            return extractGoogleUserInfo(attributes);
        }
        throw new IllegalArgumentException("Unsupported OAuth2 provider: " + registrationId);
    }

    private static OAuth2UserInfoDTO extractGoogleUserInfo(Map<String, Object> attributes) {
        OAuth2UserInfoDTO userInfo = new OAuth2UserInfoDTO();
        userInfo.setProviderId(String.valueOf(attributes.get("sub")));
        userInfo.setEmail((String) attributes.get("email"));
        userInfo.setName((String) attributes.get("name"));
        userInfo.setGivenName((String) attributes.get("given_name"));
        userInfo.setFamilyName((String) attributes.get("family_name"));
        userInfo.setImageUrl((String) attributes.get("picture"));
        userInfo.setEmailVerified((Boolean) attributes.get("email_verified"));
        return userInfo;
    }

    public static class OAuth2UserInfoDTO {
        private String providerId;
        private String email;
        private String name;
        private String givenName;
        private String familyName;
        private String imageUrl;
        private Boolean emailVerified;

        // Getters and Setters
        public String getProviderId() {
            return providerId;
        }

        public void setProviderId(String providerId) {
            this.providerId = providerId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getGivenName() {
            return givenName;
        }

        public void setGivenName(String givenName) {
            this.givenName = givenName;
        }

        public String getFamilyName() {
            return familyName;
        }

        public void setFamilyName(String familyName) {
            this.familyName = familyName;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public Boolean getEmailVerified() {
            return emailVerified;
        }

        public void setEmailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
        }
    }
}