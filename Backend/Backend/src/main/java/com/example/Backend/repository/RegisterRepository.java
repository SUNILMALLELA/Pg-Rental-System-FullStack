package com.example.Backend.repository;

import com.example.Backend.entity.Register;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegisterRepository extends JpaRepository<Register,Long> {
    public boolean existsByEmail(String email);
    Optional<Register> findByEmail(String email);
}
