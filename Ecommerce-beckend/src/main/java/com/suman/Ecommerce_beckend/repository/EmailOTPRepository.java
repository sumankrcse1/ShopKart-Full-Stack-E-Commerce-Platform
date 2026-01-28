package com.suman.Ecommerce_beckend.repository;

import com.suman.Ecommerce_beckend.model.EmailOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailOTPRepository extends JpaRepository<EmailOTP, Long> {

    Optional<EmailOTP> findByEmailAndVerifiedFalse(String email);

    Optional<EmailOTP> findByEmailAndOtpAndVerifiedFalse(String email, String otp);

    // NEW METHOD: Find verified OTP by email
    Optional<EmailOTP> findByEmailAndVerified(String email, boolean verified);

    @Modifying
    @Query("DELETE FROM EmailOTP e WHERE e.expiryTime < :now")
    void deleteExpiredOTPs(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM EmailOTP e WHERE e.email = :email")
    void deleteByEmail(@Param("email") String email);
}