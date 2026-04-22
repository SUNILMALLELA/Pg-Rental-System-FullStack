package com.example.Backend.repository;

import com.example.Backend.entity.Pg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicPgRepository extends JpaRepository<Pg,Long> {

}
