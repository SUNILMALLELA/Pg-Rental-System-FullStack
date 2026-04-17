package com.example.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "PG")
@Builder
public class Pg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String description;
    private String location;
    private Double price;
    @Enumerated(EnumType.STRING)
    private GenderPreference genderPreference;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "owner_id",nullable = false)
    private User owner;

}
