package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.PasswordResetToken;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.PasswordResetTokenRepository;
import com.suman.Ecommerce_beckend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void createPasswordResetToken(String email) throws UserException {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }

        // Generate new token
        String token = RandomStringUtils.randomAlphanumeric(40);

        // Check if token already exists for this user
        Optional<PasswordResetToken> existingTokenOpt = tokenRepository.findByUser(user);

        PasswordResetToken resetToken;
        if (existingTokenOpt.isPresent()) {
            // Update existing token
            resetToken = existingTokenOpt.get();
            resetToken.setToken(token);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
            resetToken.setUsed(false);
        } else {
            // Create new token
            resetToken = new PasswordResetToken(token, user);
        }

        tokenRepository.save(resetToken);

        // Send email
        emailService.sendPasswordResetEmail(email, token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) throws UserException {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new UserException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            throw new UserException("Password reset token has expired");
        }

        if (resetToken.isUsed()) {
            throw new UserException("Password reset token has already been used");
        }

        // Update user password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);

        if (resetToken.isEmpty()) {
            return false;
        }

        PasswordResetToken passwordResetToken = resetToken.get();
        return !passwordResetToken.isExpired() && !passwordResetToken.isUsed();
    }

    // Clean up expired tokens (can be scheduled)
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiryDateLessThan(LocalDateTime.now());
    }
}