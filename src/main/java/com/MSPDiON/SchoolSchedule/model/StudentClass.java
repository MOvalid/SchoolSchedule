package com.MSPDiON.SchoolSchedule.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentClass {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Department department;

  @OneToMany(mappedBy = "studentClass", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Student> students = new ArrayList<>();

  public void addStudent(Student student) {
    students.add(student);
    student.setStudentClass(this);
  }

  public void removeStudent(Student student) {
    students.remove(student);
    student.setStudentClass(null);
  }
}
