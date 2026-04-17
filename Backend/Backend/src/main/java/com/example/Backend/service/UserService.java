package com.example.Backend.service;

import com.example.Backend.entity.User;
import com.example.Backend.entity.Role;
import com.example.Backend.exception.CustomException;
import com.example.Backend.dto.UserRequestDTO;
import com.example.Backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public String register(UserRequestDTO registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())){
           throw new CustomException("Email already exists",400);
        }
        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(bCryptPasswordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(Role.valueOf(registerRequest.getRole()))
                .build();
        User result =  userRepository.save(user);
         return "User Register Successfully"  ;
    }
}
