package com.example.Backend.service;

import com.example.Backend.entity.Register;
import com.example.Backend.exception.CustomException;
import com.example.Backend.repository.RegisterRepository;
import jakarta.annotation.Nonnull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginService implements UserDetailsService {

    private final RegisterRepository registerRepository;
    public LoginService(RegisterRepository registerRepository) {
        this.registerRepository = registerRepository;
    }
    @Override
    public UserDetails loadUserByUsername(@Nonnull String email) throws UsernameNotFoundException {
        Register register = registerRepository.findByEmail(email).orElseThrow(()-> new CustomException("Invalid email or password",400));
        return new org.springframework.security.core.userdetails.User(
                register.getEmail(),
                register.getPassword(),
                List.of(new SimpleGrantedAuthority(register.getRole()))
        );
    }
}
