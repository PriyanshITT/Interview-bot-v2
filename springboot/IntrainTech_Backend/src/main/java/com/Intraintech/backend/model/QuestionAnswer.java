    package com.Intraintech.backend.model;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;

    import java.time.LocalDateTime;

    @Entity
    @Table(name = "question_answers")
    @Data
    @AllArgsConstructor
    public class QuestionAnswer {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        @JsonIgnore
        private User user;


        private LocalDateTime timestamp;

        public String getQuestion() {
            return question;
        }

        @Column(nullable = false,length = 1024)
        private String question;

        @Column(nullable = false,length = 1024)
        private String answer;

        @Column(nullable = false)
        private int marks;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public User getUser() {
            return user;
        }

        public void setUser(User user) {
            this.user = user;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
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

        public QuestionAnswer() {
        }

        public QuestionAnswer(User user, String question, String answer, int marks,LocalDateTime timestamp) {
            this.user = user;
            this.question = question;
            this.answer = answer;
            this.marks = marks;
            this.timestamp =timestamp;
        }
    }
