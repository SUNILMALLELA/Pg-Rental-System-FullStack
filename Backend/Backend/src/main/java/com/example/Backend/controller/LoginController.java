package com.example.Backend.controller;

import com.example.Backend.security.JWTUtil;
import com.example.Backend.dto.LoginRequestDTO;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    public LoginController(AuthenticationManager authenticationManager,JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody LoginRequestDTO loginRequest){
       authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));
       String token = jwtUtil.generateToken(loginRequest.getEmail());
       Map<String,String> response = new HashMap<>();
       response.put("token",token);
       response.put("message","Login Successful");
       return response;

    }
}
