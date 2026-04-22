package com.example.Backend.repository;

import com.example.Backend.entity.Booking;
import com.example.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByPgOwner(User owner);
}
