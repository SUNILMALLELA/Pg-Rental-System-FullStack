package com.example.Backend.repository;

import com.example.Backend.entity.Pg;
import com.example.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PgRepository extends JpaRepository<Pg,Long> {
    List<Pg> findByOwner(User owner);
}
