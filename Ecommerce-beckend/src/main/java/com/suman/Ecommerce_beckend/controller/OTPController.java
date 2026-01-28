package com.suman.Ecommerce_beckend.controller;

import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.request.SendOTPRequest;
import com.suman.Ecommerce_beckend.request.VerifyOTPRequest;
import com.suman.Ecommerce_beckend.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/otp")
public class OTPController {

    @Autowired
    private OTPService otpService;

    /**
     * Send OTP to email for registration
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendOTP(@RequestBody SendOTPRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            otpService.generateAndSendOTP(request.getEmail());
            response.put("success", true);
            response.put("message", "OTP has been sent to your email");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send OTP. Please try again.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Verify OTP
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyOTP(@RequestBody VerifyOTPRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean isVerified = otpService.verifyOTP(request.getEmail(), request.getOtp());
            response.put("success", true);
            response.put("verified", isVerified);
            response.put("message", "Email verified successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            response.put("success", false);
            response.put("verified", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("success", false);
            response.put("verified", false);
            response.put("message", "Verification failed. Please try again.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Resend OTP
     */
    @PostMapping("/resend")
    public ResponseEntity<Map<String, Object>> resendOTP(@RequestBody SendOTPRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            otpService.resendOTP(request.getEmail());
            response.put("success", true);
            response.put("message", "New OTP has been sent to your email");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to resend OTP. Please try again.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}