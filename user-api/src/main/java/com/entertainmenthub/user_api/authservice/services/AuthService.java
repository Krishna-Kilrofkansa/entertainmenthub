package com.entertainmenthub.user_api.authservice.services;

// Corrected import paths below
import com.entertainmenthub.user_api.authservice.models.User;
import com.entertainmenthub.user_api.authservice.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password) {
        // 1. Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // 2. Create a new user object
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);

        // 3. Encode the password before saving
        user.setPassword(passwordEncoder.encode(password));

        // 4. Save the user to the database
        return userRepository.save(user);
    }
}