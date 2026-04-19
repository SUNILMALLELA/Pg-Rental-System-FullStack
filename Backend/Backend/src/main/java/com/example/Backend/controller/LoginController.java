package com.example.Backend.controller;
import com.example.Backend.security.JWTUtil;
import com.example.Backend.dto.LoginRequestDTO;
import com.example.Backend.entity.User;
import com.example.Backend.exception.CustomException;
import com.example.Backend.repository.UserRepository;
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
    private final UserRepository userRepository;
    
    public LoginController(AuthenticationManager authenticationManager,JWTUtil jwtUtil,UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
       
    }

    @PostMapping("/login")
    public Map<String,String> login(@RequestBody LoginRequestDTO loginRequest){
       authenticationManager.authenticate(
               new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));
               User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new CustomException("Invalid email",400));
       String token = jwtUtil.generateToken(loginRequest.getEmail(),user.getFullName());
       Map<String, String> response = new HashMap<>();
      response.put("token", token);      
      response.put("message", "Login Successful");
       return response;

    }
}
