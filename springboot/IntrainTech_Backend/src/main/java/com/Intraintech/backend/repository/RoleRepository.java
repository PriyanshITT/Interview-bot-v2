package com.Intraintech.backend.repository;

import com.Intraintech.backend.model.ERole;
import com.Intraintech.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository  extends JpaRepository<Role,Long> {


    Optional<Role> findByName(ERole name);
}
