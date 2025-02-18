package com.Intraintech.backend.Controller;



import com.Intraintech.backend.model.User;
import com.Intraintech.backend.payload.request.MarksRequest;
import com.Intraintech.backend.payload.response.LeaderboardResponse;
import com.Intraintech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeaderboardController {

    @Autowired
    private UserRepository userRepository;


    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    @CrossOrigin(origins = "http://localhost:5173")
    public List<LeaderboardResponse> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByMarksDesc();
        return users.stream()
                .limit(15)
                .map(user -> new LeaderboardResponse(user.getUsername(), user.getMarks(), user.getName(),user.getCountry()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{username}/marks")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserMarks(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        return ResponseEntity.ok(new LeaderboardResponse(user.getUsername(), user.getMarks(),user.getName(),user.getCountry()));
    }


    @PutMapping("/{username}/marks")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserMarks(@PathVariable String username, @RequestBody MarksRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        user.setMarks(request.getNewMarks());
        userRepository.save(user);

        return ResponseEntity.ok("Updated Successfully");
    }

}
