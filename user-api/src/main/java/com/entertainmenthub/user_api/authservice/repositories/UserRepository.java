package com.entertainmenthub.user_api.authservice.repositories;

import com.entertainmenthub.user_api.authservice.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Spring Data MongoDB will automatically create the query for this method
    // based on the method name. It will find a user by their email field.
    Optional<User> findByEmail(String email);

    // We can also add a method to check if a user exists by their email
    Boolean existsByEmail(String email);
}