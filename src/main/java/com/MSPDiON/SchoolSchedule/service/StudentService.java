package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.CreateStudentDto;
import com.MSPDiON.SchoolSchedule.dto.StudentDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.StudentMapper;
import com.MSPDiON.SchoolSchedule.exception.InvalidStudentTimeException;
import com.MSPDiON.SchoolSchedule.exception.StudentClassNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentNotFoundException;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.AvailabilityRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

  private final StudentRepository studentRepository;
  private final StudentClassRepository studentClassRepository;
  private final AvailabilityRepository availabilityRepository;
  private final StudentMapper studentMapper;

  public List<StudentDto> getAll() {
    return studentRepository.findAll().stream()
        .map(
            s ->
                studentMapper.toDto(
                    s, availabilityRepository.findByEntityIdAndEntityType(s.getId(), "STUDENT")))
        .toList();
  }

  public List<StudentDto> getAllSortedByLastName() {
    return studentRepository.findAll().stream()
        .sorted((a, b) -> a.getLastName().compareToIgnoreCase(b.getLastName()))
        .map(
            s ->
                studentMapper.toDto(
                    s, availabilityRepository.findByEntityIdAndEntityType(s.getId(), "STUDENT")))
        .toList();
  }

  public List<StudentDto> getAllByClassId(Long classId) {
    return studentRepository.findByStudentClassId(classId).stream()
        .map(
            s ->
                studentMapper.toDto(
                    s, availabilityRepository.findByEntityIdAndEntityType(s.getId(), "STUDENT")))
        .toList();
  }

  public StudentDto getById(Long id) {
    Student student =
        studentRepository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
    return studentMapper.toDto(
        student, availabilityRepository.findByEntityIdAndEntityType(student.getId(), "STUDENT"));
  }

  public StudentDto create(CreateStudentDto dto) {
    validateTimes(dto.getArrivalTime(), dto.getDepartureTime());

    Student student = studentMapper.toEntity(dto);

    if (dto.getStudentClassId() != null) {
      StudentClass studentClass =
          studentClassRepository
              .findById(dto.getStudentClassId())
              .orElseThrow(() -> new StudentClassNotFoundException(dto.getStudentClassId()));
      student.setStudentClass(studentClass);
    }

    Student saved = studentRepository.save(student);
    return studentMapper.toDto(
        saved, availabilityRepository.findByEntityIdAndEntityType(saved.getId(), "STUDENT"));
  }

  public StudentDto update(Long id, StudentDto dto) {
    validateTimes(dto.getArrivalTime(), dto.getDepartureTime());

    Student existing =
        studentRepository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));

    existing.setFirstName(dto.getFirstName());
    existing.setLastName(dto.getLastName());
    existing.setArrivalTime(dto.getArrivalTime());
    existing.setDepartureTime(dto.getDepartureTime());

    if (dto.getStudentClassId() != null) {
      StudentClass studentClass =
          studentClassRepository
              .findById(dto.getStudentClassId())
              .orElseThrow(() -> new StudentClassNotFoundException(dto.getStudentClassId()));
      existing.setStudentClass(studentClass);
    } else {
      existing.setStudentClass(null);
    }

    Student updated = studentRepository.save(existing);
    return studentMapper.toDto(
        updated, availabilityRepository.findByEntityIdAndEntityType(updated.getId(), "STUDENT"));
  }

  public void delete(Long id) {
    studentRepository.deleteById(id);
  }

  private void validateTimes(LocalTime arrival, LocalTime departure) {
    if (arrival != null && departure != null && arrival.isAfter(departure)) {
      throw new InvalidStudentTimeException();
    }
  }
}
