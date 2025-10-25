package com.entertainmenthub.user_api.authservice.controllers;

import com.entertainmenthub.user_api.authservice.models.WatchlistItem;
import com.entertainmenthub.user_api.authservice.services.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@CrossOrigin(origins = "${app.cors.allowed-origins}", maxAge = 3600)
@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addToWatchlist(@RequestBody WatchlistItem item) {
        watchlistService.addToWatchlist(item);
        return ResponseEntity.ok("Item added to watchlist successfully!");
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Set<WatchlistItem>> getWatchlist() {
        Set<WatchlistItem> watchlist = watchlistService.getWatchlist();
        return ResponseEntity.ok(watchlist);
    }

    @DeleteMapping("/{itemType}/{itemId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable String itemType, @PathVariable String itemId) {
        watchlistService.removeFromWatchlist(itemType, itemId);
        return ResponseEntity.ok("Item removed from watchlist successfully!");
    }
}