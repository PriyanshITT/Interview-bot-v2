package com.Intraintech.backend.repository;


import com.Intraintech.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
    List<User> findAllByOrderByMarksDesc();
    Boolean existsByUsername(String username);
    Optional<User> findByName(String name);
}
