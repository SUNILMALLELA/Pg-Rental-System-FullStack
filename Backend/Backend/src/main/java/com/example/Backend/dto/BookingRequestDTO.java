package com.example.Backend.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long pgId;
    private String visitDate;
    private String note;
}