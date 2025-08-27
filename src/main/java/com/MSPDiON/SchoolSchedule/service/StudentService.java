package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.CreateStudentDto;
import com.MSPDiON.SchoolSchedule.dto.StudentDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.StudentMapper;
import com.MSPDiON.SchoolSchedule.exception.StudentClassNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentNotFoundException;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentClassRepository studentClassRepository;
    private final StudentMapper studentMapper;

    public List<StudentDto> getAll() {
        return studentRepository.findAll()
                .stream()
                .map(studentMapper::toDto)
                .toList();
    }

    public List<StudentDto> getAllSortedByLastName() {
        return studentRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getLastName().compareToIgnoreCase(b.getLastName()))
                .map(studentMapper::toDto)
                .toList();
    }

    public List<StudentDto> getAllByClassId(Long classId) {
        return studentRepository.findByStudentClass_Id(classId)
                .stream()
                .map(studentMapper::toDto)
                .toList();
    }

    public StudentDto getById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        return studentMapper.toDto(student);
    }

    public StudentDto create(CreateStudentDto dto) {
        Student student = studentMapper.toEntity(dto);

        if (dto.getStudentClassId() != null) {
            StudentClass studentClass = studentClassRepository.findById(dto.getStudentClassId())
                    .orElseThrow(() -> new StudentClassNotFoundException(dto.getStudentClassId()));
            student.setStudentClass(studentClass);
        }

        Student saved = studentRepository.save(student);

        return StudentDto.builder()
                .id(saved.getId())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .arrivalTime(saved.getArrivalTime())
                .departureTime(saved.getDepartureTime())
                .studentClassId(saved.getStudentClass() != null ? saved.getStudentClass().getId() : null)
                .build();
    }


    public StudentDto update(Long id, StudentDto dto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        updateBasicInfo(existing, dto);
        updateStudentClass(existing, dto);

        Student saved = studentRepository.save(existing);
        return studentMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    private void updateBasicInfo(Student student, StudentDto dto) {
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setArrivalTime(dto.getArrivalTime());
        student.setDepartureTime(dto.getDepartureTime());
    }

    private void updateStudentClass(Student student, StudentDto dto) {
        if (dto.getStudentClassId() != null) {
            StudentClass studentClass = studentClassRepository.findById(dto.getStudentClassId())
                    .orElseThrow(() -> new RuntimeException("Student class not found"));
            student.setStudentClass(studentClass);
        } else {
            student.setStudentClass(null); // Można usunąć przypisanie do klasy
        }
    }
}
