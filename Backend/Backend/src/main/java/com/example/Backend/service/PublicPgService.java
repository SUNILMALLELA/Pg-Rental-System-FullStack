package com.example.Backend.service;

import com.example.Backend.dto.PgResponseDTO;
import com.example.Backend.entity.GenderPreference;
import com.example.Backend.entity.Pg;
import com.example.Backend.exception.CustomException;
import com.example.Backend.repository.PgRepository;
import com.example.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicPgService {
    private final UserRepository userRepository;
    private final PgRepository pgRepository;
    public List<PgResponseDTO> getPgList() {
        List<Pg> pgList = pgRepository.findAll();
        return pgList.stream().map(this::convertToDTO).toList();
    }
    public PgResponseDTO getPgById(Long id) {
        Pg pg = pgRepository.findById(id)
                .orElseThrow(() -> new CustomException("PG not found",404));
        return convertToDTO(pg);
    }
    public List<PgResponseDTO> searchPgs(String location, Double minPrice, Double maxPrice, String gender) {

        List<Pg> pgList = pgRepository.findAll();
        if (location != null && !location.isEmpty()) {
            pgList = pgList.stream()
                    .filter(pg -> pg.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .toList();
        }
        if (minPrice != null && maxPrice != null) {
            pgList = pgList.stream()
                    .filter(pg -> pg.getPrice() >= minPrice && pg.getPrice() <= maxPrice)
                    .toList();
        }
        if (gender != null && !gender.isEmpty()) {
            GenderPreference genderEnum = GenderPreference.valueOf(gender.toUpperCase());
            pgList = pgList.stream()
                    .filter(pg -> pg.getGenderPreference() == genderEnum)
                    .toList();
        }
        return pgList.stream()
                .map(this::convertToDTO)
                .toList();
    }
    private PgResponseDTO convertToDTO(Pg pg){
      return PgResponseDTO.builder()
               .id(pg.getId())
               .title(pg.getTitle())
               .price(pg.getPrice())
               .description(pg.getDescription())
               .genderPreference(pg.getGenderPreference().name())
               .location(pg.getLocation())
               .ownerName(pg.getOwner().getFullName())
               .build();
    }

    }
