package com.example.Backend.controller;
import com.example.Backend.model.RegisterRequest;
import com.example.Backend.service.RegisterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest){
        String response =  registerService.register(registerRequest);
        return ResponseEntity.ok(response);
    }
}
