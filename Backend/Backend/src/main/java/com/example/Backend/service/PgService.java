package com.example.Backend.service;

import com.example.Backend.entity.GenderPreference;
import com.example.Backend.entity.Pg;
import com.example.Backend.entity.User;
import com.example.Backend.entity.Role;
import com.example.Backend.exception.CustomException;
import com.example.Backend.dto.PgRequestDTO;
import com.example.Backend.dto.PgResponseDTO;
import com.example.Backend.repository.PgRepository;
import com.example.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class PgService {
    private final UserRepository userRepository;
    private final PgRepository pgRepository;
    public PgResponseDTO createPg(PgRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(email).orElseThrow(() -> new CustomException("User not found", 403));
        if (owner.getRole() != Role.OWNER) {
            throw new CustomException("Only owners can add PG", 400);
        }
        Pg pg = Pg.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .price(dto.getPrice())
                .genderPreference(GenderPreference.valueOf(dto.getGenderPreference()))
                .createdAt(LocalDateTime.now())
                .owner(owner)
                .build();
    Pg saved = pgRepository.save(pg);
    return PgResponseDTO.builder()
            .id(saved.getId())
            .title(saved.getTitle())
            .description(saved.getDescription())
            .price(saved.getPrice())
            .genderPreference(saved.getGenderPreference().name())
            .ownerName(owner.getFullName())
            .build();

    }

    public List<PgResponseDTO> getAllOwnerPgs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(email).orElseThrow(()->new CustomException("User not found",400));
        if(owner.getRole() != Role.OWNER){
            throw new CustomException("Access denied",403);
        }
        List<Pg> pgs = pgRepository.findByOwner(owner);
        return pgs.stream().map(pg -> PgResponseDTO.builder()
                .id(pg.getId())
                .title(pg.getTitle())
                .description(pg.getDescription())
                .location(pg.getLocation())
                .price(pg.getPrice())
                .genderPreference(pg.getGenderPreference().name())
                .ownerName(owner.getFullName())
                .build()).toList();
    }

    public PgResponseDTO updatePg(Long id, PgRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(email).orElseThrow(()-> new CustomException("User not found",400));
        Pg pg = pgRepository.findById(id).orElseThrow(()-> new CustomException("Pg  not found",404));
        if (pg.getOwner().getId() != owner.getId()) {
            throw new CustomException("You are not allowed", 403);
        }
        pg.setTitle(dto.getTitle());
        pg.setDescription(dto.getDescription());
        pg.setLocation(dto.getLocation());
        pg.setPrice(dto.getPrice());
        pg.setGenderPreference(
                GenderPreference.valueOf(dto.getGenderPreference().toUpperCase())
        );

        Pg updated = pgRepository.save(pg);
        return PgResponseDTO.builder()
                .id(updated.getId())
                .title(updated.getTitle())
                .description(updated.getDescription())
                .location(updated.getLocation())
                .price(updated.getPrice())
                .genderPreference(updated.getGenderPreference().name())
                .ownerName(owner.getFullName())
                .build();
    }

    public String deletePg(Long pgId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(email).orElseThrow(() -> new CustomException("User not found", 400));
        Pg pg = pgRepository.findById(pgId).orElseThrow(() -> new CustomException("PG not found", 404));
        if (pg.getOwner().getId() != owner.getId()) {
            throw new CustomException("You are not allowed", 403);
        }
        pgRepository.delete(pg);
        return "PG deleted successfully";
    }
}
