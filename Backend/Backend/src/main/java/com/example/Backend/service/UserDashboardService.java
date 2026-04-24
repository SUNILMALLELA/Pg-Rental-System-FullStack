package com.example.Backend.service;

import com.example.Backend.dto.UserBookingDTO;
import com.example.Backend.entity.BookingStatus;
import com.example.Backend.entity.User;
import com.example.Backend.exception.CustomException;
import com.example.Backend.repository.BookingRepository;
import com.example.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserDashboardService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private User getCurrentuser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(()-> new CustomException("user not found",400));
    }
    public Map<String, Object> getStatusCount() {
        User user = getCurrentuser();
        long userId = user.getId();
        long totalBookings = bookingRepository.countByUserId(userId);
        long approved = bookingRepository.countByUserIdAndStatus(userId, BookingStatus.APPROVED);
        long rejected = bookingRepository.countByUserIdAndStatus(userId,BookingStatus.REJECTED);
        long pending = bookingRepository.countByUserIdAndStatus(userId,BookingStatus.PENDING);
        Map<String,Object> status = new HashMap<>();
        status.put("totalBookings",totalBookings);
        status.put("approved",approved);
        status.put("rejected",rejected);
        status.put("pending",pending);
        return status;
    }

    public List<UserBookingDTO> getApprovedBookings() {
        User user = getCurrentuser();
        Long userId = user.getId();
        return bookingRepository.getAllBookings(userId);
    }
}
