package com.example.Backend.dto;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {
    private String fullName;
    @Column(unique = true)
    private String email;
    private String password;
    private String phoneNumber;
    private String role;
}
