package com.suman.Ecommerce_beckend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send OTP email for registration verification
     */
    public void sendOTPEmail(String toEmail, String otp, int expiryMinutes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email - ShopKart Registration");

            String htmlContent = buildOTPEmail(otp, expiryMinutes);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request - ShopKart");

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        message.setText("Dear User,\n\n" +
                "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                resetUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "ShopKart Team");

        mailSender.send(message);
    }

    /**
     * Build HTML email for OTP
     */
    private String buildOTPEmail(String otp, int expiryMinutes) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                ".container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }" +
                ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
                ".header .logo { font-size: 32px; margin-bottom: 10px; }" +
                ".content { padding: 40px 30px; text-align: center; }" +
                ".otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 30px 0; display: inline-block; }" +
                ".otp-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; }" +
                ".info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 25px 0; text-align: left; border-radius: 4px; }" +
                ".warning { color: #e74c3c; font-weight: 600; margin-top: 20px; }" +
                ".footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; }" +
                ".button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='logo'>🛒</div>" +
                "<h1>ShopKart</h1>" +
                "<p style='margin: 5px 0 0 0; opacity: 0.9;'>Email Verification</p>" +
                "</div>" +
                "<div class='content'>" +
                "<h2 style='color: #333; margin-bottom: 20px;'>Verify Your Email Address</h2>" +
                "<p style='font-size: 16px; color: #666; margin-bottom: 30px;'>" +
                "Thank you for signing up with ShopKart! Please use the following OTP to complete your registration:" +
                "</p>" +
                "<div class='otp-box'>" +
                "<p style='margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;'>Your Verification Code</p>" +
                "<p class='otp-code'>" + otp + "</p>" +
                "</div>" +
                "<div class='info-box'>" +
                "<p style='margin: 0; font-size: 14px;'><strong>⏱️ Valid for:</strong> " + expiryMinutes + " minutes</p>" +
                "<p style='margin: 10px 0 0 0; font-size: 14px;'><strong>🔒 Security:</strong> Never share this code with anyone</p>" +
                "</div>" +
                "<p style='font-size: 14px; color: #666; margin-top: 30px;'>" +
                "Enter this code on the registration page to verify your email and complete your account setup." +
                "</p>" +
                "<p class='warning'>⚠️ If you didn't request this code, please ignore this email.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p style='margin: 0 0 10px 0;'>This is an automated message, please do not reply.</p>" +
                "<p style='margin: 0;'>&copy; 2024 ShopKart. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}