package com.example.Backend.controller;
import com.example.Backend.dto.UserRequestDTO;
import com.example.Backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRequestDTO registerRequest){
        String response =  userService.register(registerRequest);
        return ResponseEntity.ok(response);
    }
}
