package com.example.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PgRequestDTO {
    private String title;
    private String description;
    private String location;
    private Double price;
    private String genderPreference;

}
