package com.entertainmenthub.user_api.authservice.controllers;

// These import paths must also be updated to reflect the new package structure
import com.entertainmenthub.user_api.authservice.payload.RegisterRequest;
import com.entertainmenthub.user_api.authservice.payload.MessageResponse;
import com.entertainmenthub.user_api.authservice.services.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.entertainmenthub.user_api.authservice.payload.JwtResponse;
import com.entertainmenthub.user_api.authservice.payload.LoginRequest;
import com.entertainmenthub.user_api.authservice.security.jwt.JwtUtils;
import com.entertainmenthub.user_api.authservice.security.services.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerUser(
                    registerRequest.getUsername(),
                    registerRequest.getEmail(),
                    registerRequest.getPassword()
            );
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(), // Note: this is actually the email
                userDetails.getEmail()));
    }
}