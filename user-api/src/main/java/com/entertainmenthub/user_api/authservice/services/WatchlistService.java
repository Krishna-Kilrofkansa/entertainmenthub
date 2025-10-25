package com.entertainmenthub.user_api.authservice.services;

import com.entertainmenthub.user_api.authservice.models.User;
import com.entertainmenthub.user_api.authservice.models.WatchlistItem;
import com.entertainmenthub.user_api.authservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class WatchlistService {

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void addToWatchlist(WatchlistItem item) {
        User currentUser = getCurrentUser();
        currentUser.getWatchlist().add(item);
        userRepository.save(currentUser);
    }

    public Set<WatchlistItem> getWatchlist() {
        User currentUser = getCurrentUser();
        return currentUser.getWatchlist();
    }

    public void removeFromWatchlist(String itemType, String itemId) {
        User currentUser = getCurrentUser();
        WatchlistItem itemToRemove = new WatchlistItem(itemId, itemType);
        currentUser.getWatchlist().remove(itemToRemove);
        userRepository.save(currentUser);
    }
}