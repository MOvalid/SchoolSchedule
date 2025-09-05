package com.MSPDiON.SchoolSchedule.repository;

import com.MSPDiON.SchoolSchedule.model.StudentClass;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentClassRepository extends JpaRepository<StudentClass, Long> {

  Optional<StudentClass> findFirstByNameIgnoreCase(String name);
}
