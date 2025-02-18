package com.Intraintech.backend.Controller;

import com.Intraintech.backend.model.Tutor;
import com.Intraintech.backend.repository.TutorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tutors")
public class TutorController {

    private final TutorRepository tutorRepository;

    public TutorController(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Tutor>> getAllTutors() {
        return ResponseEntity.ok(tutorRepository.findAll());
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTutor(
            @RequestParam("name") String name,
            @RequestParam("languages") List<String> languages,
            @RequestParam("skills") List<String> skills,
            @RequestParam("experience") String experience,
            @RequestParam("price") String price,
            @RequestParam("rating") double rating,
            @RequestParam("profilePic") MultipartFile profilePic) {

        try {
            byte[] profilePicBytes = profilePic.getBytes();

            Tutor tutor = new Tutor();
            tutor.setName(name);
            tutor.setLanguages(languages);
            tutor.setSkills(skills);
            tutor.setExperience(experience);
            tutor.setPrice(price);
            tutor.setRating(rating);
            tutor.setProfilePic(profilePicBytes);

            tutorRepository.save(tutor);

            return ResponseEntity.status(HttpStatus.CREATED).body("Tutor uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing profile picture");
        }
    }
}

