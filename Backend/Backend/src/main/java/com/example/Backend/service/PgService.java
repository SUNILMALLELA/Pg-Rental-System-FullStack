package com.example.Backend.service;

import com.example.Backend.entity.GenderPreference;
import com.example.Backend.entity.Pg;
import com.example.Backend.entity.User;
import com.example.Backend.exception.CustomException;
import com.example.Backend.dto.PgRequestDTO;
import com.example.Backend.dto.PgResponseDTO;
import com.example.Backend.repository.PgRepository;
import com.example.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PgService {

    private final UserRepository userRepository;
    private final PgRepository pgRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found",400));
    }

    public PgResponseDTO createPg(PgRequestDTO dto) {
        User owner = getCurrentUser();
        Pg pg = Pg.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .price(dto.getPrice())
                .genderPreference(GenderPreference.valueOf(dto.getGenderPreference()))
                .owner(owner)
                .createdAt(LocalDateTime.now())
                .build();
        return mapToDTO(pgRepository.save(pg));
    }

    public List<PgResponseDTO> getAllOwnerPgs() {
        User owner = getCurrentUser();
        return pgRepository.findByOwner(owner)
                .stream().map(this::mapToDTO).toList();
    }

    public PgResponseDTO updatePg(Long id, PgRequestDTO dto) {
        User owner = getCurrentUser();
        Pg pg = pgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PG not found"));
        if (pg.getOwner().getId() != owner.getId()) {
        throw new CustomException("Not allowed",400);
         }
        pg.setTitle(dto.getTitle());
        pg.setDescription(dto.getDescription());
        pg.setPrice(dto.getPrice());
        return mapToDTO(pgRepository.save(pg));
    }

    public String deletePg(Long id) {
        User owner = getCurrentUser();
        Pg pg = pgRepository.findById(id)
                .orElseThrow(() -> new CustomException("PG not found",400));

        if (pg.getOwner().getId() != owner.getId()) {
        throw new CustomException("Not allowed",400);
        }
        pgRepository.delete(pg);
        return "Deleted";
    }

    private PgResponseDTO mapToDTO(Pg pg) {
        return PgResponseDTO.builder()
                .id(pg.getId())
                .title(pg.getTitle())
                .price(pg.getPrice())
                .location(pg.getLocation())
                .ownerName(pg.getOwner().getFullName())
                .build();
    }
}