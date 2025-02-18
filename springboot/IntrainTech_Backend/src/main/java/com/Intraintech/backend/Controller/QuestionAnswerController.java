package com.Intraintech.backend.Controller;

import com.Intraintech.backend.model.QuestionAnswer;
import com.Intraintech.backend.model.User;
import com.Intraintech.backend.payload.request.QuestionAnswerRequest;
import com.Intraintech.backend.repository.QuestionAnswerRepository;
import com.Intraintech.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Long.sum;

@RestController
@RequestMapping("/api/question-answers")
public class QuestionAnswerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionAnswerRepository questionAnswerRepository;

    @PostMapping("/add/userid/{userId}/username/{username}")
    public ResponseEntity<?> addQuestionAnswer(
            @PathVariable Long userId,
            @PathVariable String username,
            @RequestBody QuestionAnswerRequest questionAnswerRequest) {


        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }



        QuestionAnswer questionAnswer = new QuestionAnswer(
                user,
                questionAnswerRequest.getQuestion(),
                questionAnswerRequest.getAnswer(),
                questionAnswerRequest.getMarks(),
                questionAnswerRequest.getTimestamp()
        );


        questionAnswerRepository.save(questionAnswer);
        User user1 = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Error: User not found!"));
        int totalMarks = user.getQuestionAnswers().stream()
                .mapToInt(QuestionAnswer::getMarks)
                .sum();


        user1.setMarks(totalMarks);

        userRepository.save(user1);



        return ResponseEntity.ok("Question and answer added successfully.");
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getQuestionAnswersByUserId(@PathVariable Long userId) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }


        List<QuestionAnswer> questionAnswers = questionAnswerRepository.findByUser(user);
        return ResponseEntity.ok(questionAnswers);
    }

    @GetMapping("/get-sorted/{userId}")
    public ResponseEntity<?> getSortedQuestionAnswersByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "asc") String sortOrder) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Get sorted QuestionAnswers based on timestamp
        List<QuestionAnswer> sortedQuestionAnswers;
        if ("desc".equalsIgnoreCase(sortOrder)) {
            sortedQuestionAnswers = questionAnswerRepository.findByUserOrderByTimestampDesc(user);
        } else {
            sortedQuestionAnswers = questionAnswerRepository.findByUserOrderByTimestampAsc(user);
        }

        // Convert QuestionAnswer entities to QuestionAnswerRequest DTOs
        List<QuestionAnswerRequest> questionAnswerDTOs = sortedQuestionAnswers.stream()
                .map(qa -> new QuestionAnswerRequest(qa.getQuestion(), qa.getAnswer(), qa.getMarks(), qa.getTimestamp()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(questionAnswerDTOs); // Returns all components
    }




}
