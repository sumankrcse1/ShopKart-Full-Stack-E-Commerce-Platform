package com.suman.Ecommerce_beckend.repository;

import com.suman.Ecommerce_beckend.model.PasswordResetToken;
import com.suman.Ecommerce_beckend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);

    void deleteByExpiryDateLessThan(LocalDateTime now);

    void deleteByUser(User user);

    Optional<PasswordResetToken> findByUserId(Long userId);
}
