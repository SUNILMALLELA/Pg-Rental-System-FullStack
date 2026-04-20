package com.example.Backend.controller;

import com.example.Backend.dto.PgRequestDTO;
import com.example.Backend.dto.PgResponseDTO;
import com.example.Backend.service.PgService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pgs")
@RequiredArgsConstructor
public class PgController {

    private final PgService pgservice;
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<PgResponseDTO> createPg(@RequestBody PgRequestDTO dto){
        return ResponseEntity.ok(pgservice.createPg(dto));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<PgResponseDTO>> getAllOwnerPgs(){
        return ResponseEntity.ok(pgservice.getAllOwnerPgs());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<PgResponseDTO> updatePg(@PathVariable Long id,@RequestBody PgRequestDTO dto){
        return ResponseEntity.ok(pgservice.updatePg(id,dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<String> deletePg(@PathVariable Long id) {
        return ResponseEntity.ok(pgservice.deletePg(id));
    }
}