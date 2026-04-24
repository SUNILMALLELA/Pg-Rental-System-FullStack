package com.example.Backend.service;

import com.example.Backend.dto.*;
import com.example.Backend.entity.*;
import com.example.Backend.exception.CustomException;
import com.example.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final UserRepository userRepository;
    private final PgRepository pgRepository;
    private final BookingRepository bookingRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", 400));
    }

    public BookingResponseDTO createBooking(BookingRequestDTO dto){

    User user = getCurrentUser();

    Pg pg = pgRepository.findById(dto.getPgId())
            .orElseThrow(() -> new CustomException("Pg not found",400));

    Booking booking = Booking.builder()
            .user(user)
            .pg(pg)
            .status(BookingStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .visitDate(dto.getVisitDate())   
            .note(dto.getNote())             
            .build();

    return mapToDTO(bookingRepository.save(booking));
}

    public List<BookingResponseDTO> getAllBooking() {
        User user = getCurrentUser();

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<BookingResponseDTO> getOwnerBookings() {
        User owner = getCurrentUser();

        return bookingRepository.findByPg_Owner(owner) 
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public BookingResponseDTO updateStatus(Long id, BookingStatus status) {
        User owner = getCurrentUser();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new CustomException("Booking not found", 404));

        if (!booking.getPg().getOwner().getId().equals(owner.getId())) {
            throw new CustomException("Unauthorized", 403);
        }

        booking.setStatus(status);
        return mapToDTO(bookingRepository.save(booking));
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .bookingId(booking.getId())
                .pgTitle(booking.getPg().getTitle())
                .location(booking.getPg().getLocation())
                .price(booking.getPg().getPrice())
                .ownerName(booking.getPg().getOwner().getFullName())
                .status(booking.getStatus().name())
                .visitDate(booking.getVisitDate())
                .note(booking.getNote())
                .bookedAt(booking.getCreatedAt().toString())
                .build();
    }
}