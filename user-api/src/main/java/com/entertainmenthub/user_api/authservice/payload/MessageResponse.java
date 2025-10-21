package com.entertainmenthub.user_api.authservice.payload;

public class MessageResponse {
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    // Generate Getter and Setter for message
    // ...

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}