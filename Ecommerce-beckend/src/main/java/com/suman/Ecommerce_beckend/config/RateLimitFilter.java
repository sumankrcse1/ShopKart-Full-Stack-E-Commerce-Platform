package com.suman.Ecommerce_beckend.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired
    private RateLimitConfig rateLimitConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Skip rate limiting for certain paths
        if (shouldSkipRateLimit(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        Bucket bucket = resolveBucket(request, path);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // Add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            response.addHeader("X-Rate-Limit-Retry-After-Seconds",
                    String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));

            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));

            String jsonResponse = String.format(
                    "{\"error\": \"Too many requests\", " +
                            "\"message\": \"Rate limit exceeded. Please try again in %d seconds.\", " +
                            "\"retryAfter\": %d}",
                    waitForRefill, waitForRefill
            );

            response.getWriter().write(jsonResponse);
        }
    }

    private Bucket resolveBucket(HttpServletRequest request, String path) {
        String clientIp = getClientIP(request);

        // Authentication endpoints - strict rate limiting
        if (path.startsWith("/auth/signin") || path.startsWith("/auth/signup")) {
            return rateLimitConfig.resolveAuthBucket(clientIp);
        }

        // OTP endpoints - email-based rate limiting
        if (path.startsWith("/auth/otp/send") || path.startsWith("/auth/otp/resend")) {
            String email = extractEmailFromRequest(request);
            return rateLimitConfig.resolveOtpSendBucket(email != null ? email : clientIp);
        }

        if (path.startsWith("/auth/otp/verify")) {
            String email = extractEmailFromRequest(request);
            return rateLimitConfig.resolveOtpVerifyBucket(email != null ? email : clientIp);
        }

        // Password reset - email-based rate limiting
        if (path.startsWith("/auth/forgot-password") || path.startsWith("/auth/reset-password")) {
            String email = extractEmailFromRequest(request);
            return rateLimitConfig.resolvePasswordResetBucket(email != null ? email : clientIp);
        }

        // Admin endpoints - higher limits
        if (path.startsWith("/api/admin")) {
            return rateLimitConfig.resolveAdminBucket(clientIp);
        }

        // General API endpoints
        if (path.startsWith("/api/")) {
            return rateLimitConfig.resolveApiBucket(clientIp);
        }

        // Default bucket for other paths
        return rateLimitConfig.resolveApiBucket(clientIp);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String extractEmailFromRequest(HttpServletRequest request) {
        try {
            // Try to get email from request body
            // This is a simple implementation - you might need to parse JSON body
            String contentType = request.getContentType();
            if (contentType != null && contentType.contains("application/json")) {
                // For simplicity, we're using IP if we can't extract email
                // In production, you'd want to parse the JSON body properly
                return null;
            }
        } catch (Exception e) {
            // Fallback to IP-based limiting
        }
        return null;
    }

    private boolean shouldSkipRateLimit(String path) {
        // Skip rate limiting for health checks, static resources, etc.
        return path.startsWith("/actuator") ||
                path.startsWith("/health") ||
                path.startsWith("/static") ||
                path.startsWith("/css") ||
                path.startsWith("/js") ||
                path.startsWith("/images");
    }
}