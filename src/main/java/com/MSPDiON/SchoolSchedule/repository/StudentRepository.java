package com.MSPDiON.SchoolSchedule.repository;

import com.MSPDiON.SchoolSchedule.model.Student;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
  List<Student> findByStudentClass_Id(Long classId);
}
