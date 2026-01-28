package com.suman.Ecommerce_beckend.response;

public class AuthResponse {
    private String jwt;
    private String message;
    private String role;

    public AuthResponse(String jwt, String message, String role) {
        this.jwt = jwt;
        this.message = message;
        this.role = role;
    }

    public AuthResponse() {
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
