package com.example.Backend.dto;

import com.example.Backend.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class UserBookingDTO {
    private Long bookingId;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private String pgTitle;
    private String location;
    private String ownerPhone;
}
