package com.example.Backend.controller;

import com.example.Backend.dto.UserBookingDTO;
import com.example.Backend.service.UserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/")
@RequiredArgsConstructor
public class UserDashboardController {
    private final UserDashboardService userDashboardService;
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/status")
    Map<String,Object> getStatus(){
        return userDashboardService.getStatusCount();
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public List<UserBookingDTO> getApprovedBookings() {
        return userDashboardService.getApprovedBookings();
    }
}
