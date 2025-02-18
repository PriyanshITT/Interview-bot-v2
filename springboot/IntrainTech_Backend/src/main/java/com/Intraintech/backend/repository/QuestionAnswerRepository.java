package com.Intraintech.backend.repository;

import com.Intraintech.backend.model.QuestionAnswer;
import com.Intraintech.backend.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
    @EntityGraph(attributePaths = {"user"})
    List<QuestionAnswer> findByUser(User user);
    List<QuestionAnswer> findByUserOrderByTimestampDesc(User user);
    List<QuestionAnswer> findByUserOrderByTimestampAsc(User user);
}
