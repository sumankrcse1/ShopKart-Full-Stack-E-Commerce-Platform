package com.suman.Ecommerce_beckend.controller;

import com.suman.Ecommerce_beckend.config.JwtProvider;
import com.suman.Ecommerce_beckend.exception.UserException;
import com.suman.Ecommerce_beckend.model.Cart;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.repository.UserRepository;
import com.suman.Ecommerce_beckend.request.ForgotPasswordRequest;
import com.suman.Ecommerce_beckend.request.LoginRequest;
import com.suman.Ecommerce_beckend.request.ResetPasswordRequest;
import com.suman.Ecommerce_beckend.response.AuthResponse;
import com.suman.Ecommerce_beckend.service.CartService;
import com.suman.Ecommerce_beckend.service.CustomUserServiceImplementation;
import com.suman.Ecommerce_beckend.service.OTPService;
import com.suman.Ecommerce_beckend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserServiceImplementation customUserService;
    private final CartService cartService;
    private final PasswordResetService passwordResetService;
    private final OTPService otpService;

    @Value("${admin.email}")
    private String adminEmail;

    public AuthController(
            UserRepository userRepository,
            JwtProvider jwtProvider,
            PasswordEncoder passwordEncoder,
            CustomUserServiceImplementation customUserService,
            CartService cartService,
            PasswordResetService passwordResetService,
            OTPService otpService) {

        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
        this.customUserService = customUserService;
        this.cartService = cartService;
        this.passwordResetService = passwordResetService;
        this.otpService = otpService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(
            @RequestBody User user) throws UserException {

        String email = user.getEmail();

        // Check if user already exists
        User isEmailExist = userRepository.findByEmail(email);
        if (isEmailExist != null) {
            throw new UserException("Email is already used with another account");
        }

        // UPDATED: Enforce OTP verification for ALL users (including admin)
        if (!otpService.isEmailVerified(email)) {
            throw new UserException("Email not verified. Please verify your email with OTP first.");
        }

        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
        createdUser.setFirstName(user.getFirstName());
        createdUser.setLastName(user.getLastName());
        createdUser.setMobile(user.getMobile());
        createdUser.setCreatedAt(LocalDateTime.now());

        // Assign role based on email
        boolean isAdminEmail = email.equalsIgnoreCase(adminEmail);
        if (isAdminEmail) {
            createdUser.setRole("ADMIN");
        } else {
            createdUser.setRole("CUSTOMER");
        }

        User savedUser = userRepository.save(createdUser);

        // Create cart for user
        Cart cart = cartService.createCart(savedUser);

        // Clean up OTP after successful registration (only if not admin)
        if (!isAdminEmail) {
            otpService.cleanupOTP(email);
        }

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        savedUser.getEmail(),
                        savedUser.getPassword()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("signup Success");
        authResponse.setRole(savedUser.getRole());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> loginUserHandler(@RequestBody LoginRequest loginRequest) {
        try {
            String username = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            Authentication authentication = authenticate(username, password);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtProvider.generateToken(authentication);

            User user = userRepository.findByEmail(username);

            AuthResponse authResponse = new AuthResponse();
            authResponse.setJwt(token);
            authResponse.setMessage("Signin Success");
            authResponse.setRole(user.getRole());

            return new ResponseEntity<>(authResponse, HttpStatus.OK);

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "An error occurred during login");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        Map<String, String> response = new HashMap<>();

        try {
            passwordResetService.createPasswordResetToken(request.getEmail());
            response.put("message", "Password reset link has been sent to your email");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            response.put("message", "If an account exists with this email, a password reset link will be sent");
            // Return 200 even for non-existent emails to prevent email enumeration
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    // NEW: Reset Password Endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        Map<String, String> response = new HashMap<>();

        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            response.put("message", "Password has been reset successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UserException e) {
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    // NEW: Validate Token Endpoint
    @GetMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Boolean>> validateResetToken(
            @RequestParam String token) {

        Map<String, Boolean> response = new HashMap<>();
        boolean isValid = passwordResetService.validateToken(token);
        response.put("valid", isValid);

        return new ResponseEntity<>(response, isValid ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    private Authentication authenticate(String username, String password) {

        UserDetails userDetails =
                customUserService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid Username");
        }

        if (!passwordEncoder.matches(
                password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}