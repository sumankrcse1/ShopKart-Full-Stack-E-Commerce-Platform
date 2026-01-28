package com.suman.Ecommerce_beckend.config;

import com.suman.Ecommerce_beckend.security.oauth2.CustomOAuth2User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtProvider {

    private final SecretKey key =
            Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public String generateToken(Authentication auth) {
        String email;

        // Check if it's OAuth2 authentication
        if (auth.getPrincipal() instanceof CustomOAuth2User) {
            CustomOAuth2User oauth2User = (CustomOAuth2User) auth.getPrincipal();
            email = oauth2User.getEmail();
        }
        // Check if it's regular UserDetails authentication
        else if (auth.getPrincipal() instanceof UserDetails) {
            email = ((UserDetails) auth.getPrincipal()).getUsername();
        }
        // Fallback to getName() for other cases
        else {
            email = auth.getName();
        }

        return Jwts.builder()
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .claim("email", email)
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("email", String.class);
    }
}