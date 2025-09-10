package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.CreateStudentDto;
import com.MSPDiON.SchoolSchedule.dto.StudentDto;
import com.MSPDiON.SchoolSchedule.model.Availability;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudentMapper {

  private final StudentClassRepository studentClassRepository;
  private final AvailabilityMapper availabilityMapper;

  public StudentDto toDto(Student entity, List<Availability> availabilities) {
    if (entity == null) return null;
    return StudentDto.builder()
        .id(entity.getId())
        .firstName(entity.getFirstName())
        .lastName(entity.getLastName())
        .arrivalTime(entity.getArrivalTime())
        .departureTime(entity.getDepartureTime())
        .availabilities(availabilityMapper.toDtoList(availabilities.stream().toList()))
        .studentClassId(entity.getStudentClass() != null ? entity.getStudentClass().getId() : null)
        .build();
  }

  public Student toEntity(CreateStudentDto dto) {
    if (dto == null) return null;

    StudentClass studentClass = null;
    if (dto.getStudentClassId() != null) {
      studentClass =
          studentClassRepository
              .findById(dto.getStudentClassId())
              .orElseThrow(
                  () ->
                      new IllegalArgumentException(
                          "StudentClass not found: " + dto.getStudentClassId()));
    }

    return Student.builder()
        .firstName(dto.getFirstName())
        .lastName(dto.getLastName())
        .arrivalTime(dto.getArrivalTime())
        .departureTime(dto.getDepartureTime())
        .studentClass(studentClass)
        .build();
  }
}
