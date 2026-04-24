package com.example.Backend.repository;

import com.example.Backend.dto.UserBookingDTO;
import com.example.Backend.entity.Booking;
import com.example.Backend.entity.BookingStatus;
import com.example.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {
    List<Booking> findByUser(User user);
   List<Booking> findByPg_Owner(User owner);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, BookingStatus status);
    @Query("""
SELECT new com.example.Backend.dto.UserBookingDTO(
    b.id,
    b.status,
    b.createdAt,
    p.title,
    p.location,
    owner.phoneNumber
)
FROM Booking b
JOIN b.pg p
JOIN p.owner owner
WHERE b.user.id = :userId
""")
    List<UserBookingDTO> getAllBookings(@Param("userId") Long userId);}
