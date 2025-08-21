package com.MSPDiON.SchoolSchedule.repository;

import com.MSPDiON.SchoolSchedule.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByStudentClass_Id(Long classId);
}
