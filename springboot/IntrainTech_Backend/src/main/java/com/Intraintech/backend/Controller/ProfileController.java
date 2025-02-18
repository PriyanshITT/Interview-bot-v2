package com.Intraintech.backend.Controller;


import com.Intraintech.backend.model.User;
import com.Intraintech.backend.payload.request.UserResponseRequest;
import com.Intraintech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/get/id/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Optional<UserResponseRequest> getProfile(@PathVariable long id) {
        return userRepository.findById(id)
                .map(user -> {
                    int totalMarks = user.getQuestionAnswers()
                            .stream()
                            .mapToInt(qa -> qa.getMarks())
                            .sum();
                    return new UserResponseRequest(user.getName(), user.getUsername(), totalMarks);
                });
    }

}
