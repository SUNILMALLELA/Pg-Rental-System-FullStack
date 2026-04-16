package com.example.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PgResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double price;
    private String genderPreference;
    private String ownerName;
}
