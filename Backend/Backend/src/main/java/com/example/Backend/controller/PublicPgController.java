package com.example.Backend.controller;

import com.example.Backend.dto.PgResponseDTO;
import com.example.Backend.service.PublicPgService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicPgController {
    private final PublicPgService publicPgService;
    @PreAuthorize("hasAnyRole('USER','OWNER')")
    @GetMapping("/allPgs")
    public ResponseEntity<List<PgResponseDTO>> allPgList(){
        return ResponseEntity.ok(publicPgService.getPgList());
    }
    @PreAuthorize("hasAnyRole('USER','OWNER')")
    @GetMapping("/allPgs/{id}")
    public ResponseEntity<PgResponseDTO>getPgById(@PathVariable Long id){
        return ResponseEntity.ok(publicPgService.getPgById(id));
    }
    @PreAuthorize("hasAnyRole('USER','OWNER')")
    @GetMapping("/search")
    public ResponseEntity<List<PgResponseDTO>> searchPgs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String gender
    ) {
        return ResponseEntity.ok(
                publicPgService.searchPgs(location, minPrice, maxPrice, gender)
        );
    }
}
