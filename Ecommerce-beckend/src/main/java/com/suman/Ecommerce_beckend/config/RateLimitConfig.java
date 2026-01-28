package com.suman.Ecommerce_beckend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> authCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> otpCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> apiCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> adminCache = new ConcurrentHashMap<>();

    /**
     * Rate limit for authentication endpoints (login/signup)
     * 5 requests per minute per IP
     */
    public Bucket resolveAuthBucket(String key) {
        return authCache.computeIfAbsent(key, k -> createAuthBucket());
    }

    private Bucket createAuthBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Rate limit for OTP endpoints
     * 3 OTP requests per hour per email
     * 10 verification attempts per 10 minutes per email
     */
    public Bucket resolveOtpSendBucket(String email) {
        return otpCache.computeIfAbsent("send_" + email, k -> createOtpSendBucket());
    }

    private Bucket createOtpSendBucket() {
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofHours(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public Bucket resolveOtpVerifyBucket(String email) {
        return otpCache.computeIfAbsent("verify_" + email, k -> createOtpVerifyBucket());
    }

    private Bucket createOtpVerifyBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(10)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Rate limit for general API endpoints
     * 100 requests per minute per IP
     */
    public Bucket resolveApiBucket(String key) {
        return apiCache.computeIfAbsent(key, k -> createApiBucket());
    }

    private Bucket createApiBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Rate limit for admin endpoints
     * 200 requests per minute per admin user
     */
    public Bucket resolveAdminBucket(String key) {
        return adminCache.computeIfAbsent(key, k -> createAdminBucket());
    }

    private Bucket createAdminBucket() {
        Bandwidth limit = Bandwidth.classic(200, Refill.intervally(200, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Rate limit for password reset endpoints
     * 3 requests per hour per email
     */
    public Bucket resolvePasswordResetBucket(String email) {
        return otpCache.computeIfAbsent("reset_" + email, k -> createPasswordResetBucket());
    }

    private Bucket createPasswordResetBucket() {
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofHours(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Clear expired entries from cache (can be scheduled)
     */
    public void clearCache() {
        authCache.clear();
        otpCache.clear();
        apiCache.clear();
        adminCache.clear();
    }
}