package com.example.Backend.model;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String fullName;
    @Column(unique = true)
    private String email;
    private String password;
    private String phoneNumber;
    private String role;
}
