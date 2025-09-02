package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.StudentClassDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.StudentClassMapper;
import com.MSPDiON.SchoolSchedule.exception.StudentClassNotFoundException;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentClassService {

  private final StudentClassRepository studentClassRepository;
  private final StudentClassMapper studentClassMapper;

  public List<StudentClassDto> getAll() {
    return studentClassRepository.findAll().stream().map(studentClassMapper::toDto).toList();
  }

  public StudentClassDto getById(Long id) {
    StudentClass sc =
        studentClassRepository
            .findById(id)
            .orElseThrow(() -> new StudentClassNotFoundException(id));
    return studentClassMapper.toDto(sc);
  }

  public StudentClassDto create(StudentClassDto dto) {
    StudentClass entity = studentClassMapper.toEntity(dto);
    StudentClass saved = studentClassRepository.save(entity);
    return studentClassMapper.toDto(saved);
  }

  public StudentClassDto update(Long id, StudentClassDto dto) {
    StudentClass existing =
        studentClassRepository
            .findById(id)
            .orElseThrow(() -> new StudentClassNotFoundException(id));

    existing.setName(dto.getName());
    existing.setDepartment(dto.getDepartment());

    StudentClass saved = studentClassRepository.save(existing);
    return studentClassMapper.toDto(saved);
  }

  public void delete(Long id) {
    if (!studentClassRepository.existsById(id)) {
      throw new StudentClassNotFoundException(id);
    }
    studentClassRepository.deleteById(id);
  }
}
