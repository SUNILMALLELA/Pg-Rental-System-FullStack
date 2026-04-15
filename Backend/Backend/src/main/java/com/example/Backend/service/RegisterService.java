package com.example.Backend.service;

import com.example.Backend.entity.Register;
import com.example.Backend.exception.CustomException;
import com.example.Backend.model.RegisterRequest;
import com.example.Backend.repository.RegisterRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    private final RegisterRepository registerRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public RegisterService(RegisterRepository registerRepository,BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.registerRepository = registerRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public String register(RegisterRequest registerRequest) {
        if(registerRepository.existsByEmail(registerRequest.getEmail())){
           throw new CustomException("Email already exists",400);
        }
        Register register = Register.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(bCryptPasswordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role("USER")
                .build();
        Register result =  registerRepository.save(register);
         return "User Register Successfully"  ;
    }
}
