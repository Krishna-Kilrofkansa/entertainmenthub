package com.entertainmenthub.user_api.authservice.models;

import java.util.Objects;

// This will be embedded in the User document, so it doesn't need @Document
public class WatchlistItem {
    private String itemId;   // e.g., "550" for Fight Club
    private String itemType; // e.g., "movie", "book", "anime"

    public WatchlistItem() {}

    public WatchlistItem(String itemId, String itemType) {
        this.itemId = itemId;
        this.itemType = itemType;
    }

    // Generate Getters and Setters for itemId and itemType
    // ...

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        WatchlistItem that = (WatchlistItem) o;
        return Objects.equals(getItemId(), that.getItemId()) && Objects.equals(getItemType(), that.getItemType());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getItemId(), getItemType());
    }
}