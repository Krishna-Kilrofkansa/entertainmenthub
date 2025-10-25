package com.entertainmenthub.user_api.authservice.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

// This tells Spring this class represents a collection named "users" in MongoDB
@Document(collection = "users")
public class User {

    @Id
    private String id; // MongoDB uses String for its default _id field

    private Set<WatchlistItem> watchlist = new HashSet<>();

    public Set<WatchlistItem> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(Set<WatchlistItem> watchlist) {
        this.watchlist = watchlist;
    }

    // This ensures no two users can have the same email address
    @Indexed(unique = true)
    private String email;

    private String username;

    private String password; // This will store the BCRYPT HASHED password, not the plain text one

    // --- Constructors ---
    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // --- Getters and Setters ---
    // You can generate these automatically in your IDE (Right-click -> Generate -> Getters and Setters)

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}