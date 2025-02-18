package com.Intraintech.backend.payload.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionAnswerRequest {
    private String question;
    private String answer;
    private int marks;
    private LocalDateTime timestamp;

    // Default constructor for deserialization
    public QuestionAnswerRequest() {}

    public QuestionAnswerRequest(String question, String answer, int marks, LocalDateTime timestamp) {
        this.question = question;
        this.answer = answer;
        this.marks = marks;
        this.timestamp = timestamp;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public int getMarks() {
        return marks;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }
}
