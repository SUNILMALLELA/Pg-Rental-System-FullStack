package com.example.Backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponseDTO {
    private Long bookingId;
    private String pgTitle;
    private String location;
    private Double price;
    private String ownerName;
    private String status;
    private String bookedAt;
}
