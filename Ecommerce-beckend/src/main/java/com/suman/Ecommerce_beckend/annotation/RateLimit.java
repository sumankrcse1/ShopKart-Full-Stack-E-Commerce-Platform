package com.suman.Ecommerce_beckend.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation for method-level rate limiting
 * Usage: @RateLimit(limit = 10, duration = 60, unit = TimeUnit.SECONDS)
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {

    /**
     * Number of requests allowed
     */
    int limit() default 100;

    /**
     * Duration in seconds
     */
    long duration() default 60;

    /**
     * Rate limit key type
     */
    RateLimitKeyType keyType() default RateLimitKeyType.IP;

    enum RateLimitKeyType {
        IP,        // Rate limit by IP address
        USER,      // Rate limit by authenticated user
        EMAIL,     // Rate limit by email parameter
        GLOBAL     // Global rate limit
    }
}