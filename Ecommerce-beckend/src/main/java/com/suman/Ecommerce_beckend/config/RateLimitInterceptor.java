package com.suman.Ecommerce_beckend.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    @Autowired
    private RateLimitConfig rateLimitConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        String path = request.getRequestURI();
        String clientIp = getClientIP(request);

        Bucket bucket = getBucketForPath(path, clientIp);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));

            response.setContentType("application/json");
            String jsonResponse = String.format(
                    "{\"error\": \"Rate limit exceeded\", " +
                            "\"message\": \"Too many requests. Please try again in %d seconds.\", " +
                            "\"retryAfter\": %d}",
                    waitForRefill, waitForRefill
            );
            response.getWriter().write(jsonResponse);

            return false;
        }
    }

    private Bucket getBucketForPath(String path, String clientIp) {
        if (path.startsWith("/auth/")) {
            return rateLimitConfig.resolveAuthBucket(clientIp);
        } else if (path.startsWith("/api/admin/")) {
            return rateLimitConfig.resolveAdminBucket(clientIp);
        } else {
            return rateLimitConfig.resolveApiBucket(clientIp);
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}