package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.EmailOTP;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.EmailOTPRepository;
import com.suman.Ecommerce_beckend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OTPService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailOTPRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Value("${otp.expiry.minutes:10}")
    private int otpExpiryMinutes;

    @Value("${otp.max.attempts:5}")
    private int maxAttempts;

    private static final SecureRandom random = new SecureRandom();

    /**
     * Generate and send OTP to email
     */
    @Transactional
    public void generateAndSendOTP(String email) throws UserException {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            throw new UserException("This email is already registered. Please login instead.");
        }
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));

        // Create new OTP record
        EmailOTP emailOTP = new EmailOTP(email, otp, otpExpiryMinutes);
        otpRepository.save(emailOTP);

        // Send OTP email
        emailService.sendOTPEmail(email, otp, otpExpiryMinutes);
    }

    /**
     * Verify OTP
     */
    @Transactional
    public boolean verifyOTP(String email, String otp) throws UserException {
        Optional<EmailOTP> otpRecordOpt = otpRepository.findByEmailAndVerifiedFalse(email);

        if (otpRecordOpt.isEmpty()) {
            throw new UserException("No OTP found for this email or already verified");
        }

        EmailOTP otpRecord = otpRecordOpt.get();

        // Check if OTP is expired
        if (otpRecord.isExpired()) {
            throw new UserException("OTP has expired. Please request a new one");
        }

        // Check attempt count
        if (otpRecord.getAttemptCount() >= maxAttempts) {
            throw new UserException("Maximum verification attempts exceeded. Please request a new OTP");
        }

        // Increment attempt count
        otpRecord.incrementAttempt();

        // Check if OTP matches
        if (!otpRecord.getOtp().equals(otp)) {
            otpRepository.save(otpRecord);
            throw new UserException("Invalid OTP. Please try again");
        }

        // Mark as verified
        otpRecord.setVerified(true);
        otpRepository.save(otpRecord);

        return true;
    }

    /**
     * Resend OTP
     */
    @Transactional
    public void resendOTP(String email) throws UserException {
        // Delete old OTP if exists
        otpRepository.deleteByEmail(email);

        // Generate and send new OTP
        generateAndSendOTP(email);
    }

    /**
     * Check if email is verified - FIXED VERSION
     * This checks if there's a verified OTP for this email
     */
    public boolean isEmailVerified(String email) {
        // We need to find ANY OTP for this email where verified = true
        // Since the repository only has findByEmailAndVerifiedFalse,
        // we need to use a different approach

        // Get unverified OTP
        Optional<EmailOTP> unverifiedOtp = otpRepository.findByEmailAndVerifiedFalse(email);

        // If there's an unverified OTP, email is not verified
        if (unverifiedOtp.isPresent()) {
            return false;
        }

        // If no unverified OTP exists, we need to check if a verified one exists
        // For this, we need to add a new repository method
        // For now, we'll use findById and check manually

        // Better approach: Use the fact that verified OTPs exist in database
        // We'll need to add this method to repository
        return otpRepository.findByEmailAndVerified(email, true).isPresent();
    }

    /**
     * Clean up OTP after successful registration
     */
    @Transactional
    public void cleanupOTP(String email) {
        otpRepository.deleteByEmail(email);
    }

    /**
     * Clean up expired OTPs (can be scheduled)
     */
    @Transactional
    public void cleanupExpiredOTPs() {
        otpRepository.deleteExpiredOTPs(LocalDateTime.now());
    }
}