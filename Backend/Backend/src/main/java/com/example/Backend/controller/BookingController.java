package com.example.Backend.controller;

import com.example.Backend.dto.BookingRequestDTO;
import com.example.Backend.dto.BookingResponseDTO;
import com.example.Backend.entity.BookingStatus;
import com.example.Backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public BookingResponseDTO createBooking(@RequestBody BookingRequestDTO dto) {
        return bookingService.createBooking(dto);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public List<BookingResponseDTO> userBooking() {
        return bookingService.getAllBooking();
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public List<BookingResponseDTO> ownerBookings() {
        return bookingService.getOwnerBookings();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER')")
    public BookingResponseDTO updateStatus(@PathVariable Long id,
                                           @RequestParam BookingStatus status) {
        return bookingService.updateStatus(id, status);
    }
}