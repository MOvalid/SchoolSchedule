package com.MSPDiON.SchoolSchedule.dto.mapper;

import static com.MSPDiON.SchoolSchedule.utils.DateUtils.parseToLocalDate;
import static com.MSPDiON.SchoolSchedule.utils.DateUtils.parseToLocalTime;

import com.MSPDiON.SchoolSchedule.dto.CreateScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.exception.ConflictException;
import com.MSPDiON.SchoolSchedule.model.*;
import com.MSPDiON.SchoolSchedule.repository.RoomRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduleMapper {

  private final TherapistRepository therapistRepository;
  private final RoomRepository roomRepository;
  private final StudentClassRepository studentClassRepository;
  private final StudentRepository studentRepository;

  public ScheduleSlot toEntity(ScheduleSlotDto dto) {
    Therapist therapist = therapistRepository.findById(dto.getTherapistId()).orElseThrow();
    Room room = roomRepository.findById(dto.getRoomId()).orElseThrow();

    StudentClass studentClass = null;
    if (dto.getStudentClassId() != null) {
      studentClass = studentClassRepository.findById(dto.getStudentClassId()).orElseThrow();
    }

    Set<Student> students = new HashSet<>();
    if (dto.getStudentIds() != null) {
      students = new HashSet<>(studentRepository.findAllById(dto.getStudentIds()));
    }

    LocalTime start = parseToLocalTime(dto.getStartTime());
    LocalTime end = parseToLocalTime(dto.getEndTime());

    LocalDate validFrom = parseToLocalDate(dto.getValidFrom());
    LocalDate validTo =
        dto.getValidTo() != null && !dto.getValidTo().trim().isEmpty()
            ? parseToLocalDate(dto.getValidTo())
            : null;

    return ScheduleSlot.builder()
        .id(dto.getId())
        .title(dto.getTitle())
        .therapist(therapist)
        .room(room)
        .startTime(start)
        .endTime(end)
        .validFrom(validFrom)
        .validTo(validTo)
        .dayOfWeek(DayOfWeek.of(dto.getDayOfWeek()))
        .studentClass(studentClass)
        .students(students)
        .isIndividual(dto.isIndividual())
        .build();
  }

  public ScheduleSlot toEntity(CreateScheduleSlotDto dto) {
    Map<String, String> errors = new HashMap<>();

    if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
      errors.put("title", "Nazwa zajęć jest wymagana");
    }
    if (dto.getTherapistId() == null) {
      errors.put("therapist", "Terapeuta jest wymagany");
    }
    if (dto.getRoomId() == null) {
      errors.put("room", "Sala jest wymagana");
    }
    if (dto.getValidFrom() == null) {
      errors.put("validFrom", "Data początku obowiązywania jest wymagana");
    }

    Therapist therapist = null;
    if (dto.getTherapistId() != null) {
      therapist = therapistRepository.findById(dto.getTherapistId()).orElse(null);
      if (therapist == null) errors.put("therapist", "Nie znaleziono terapeuty");
    }

    Room room = null;
    if (dto.getRoomId() != null) {
      room = roomRepository.findById(dto.getRoomId()).orElse(null);
      if (room == null) errors.put("room", "Nie znaleziono sali");
    }

    StudentClass studentClass = null;
    if (dto.getStudentClassId() != null) {
      studentClass = studentClassRepository.findById(dto.getStudentClassId()).orElse(null);
      if (studentClass == null) errors.put("studentClass", "Nie znaleziono klasy");
    }

    Set<Student> students = new HashSet<>();
    if (dto.getStudentId() != null) {
      studentRepository
          .findById(dto.getStudentId())
          .ifPresentOrElse(students::add, () -> errors.put("students", "Nie znaleziono ucznia"));
    }
    if (dto.getStudentIds() != null && !dto.getStudentIds().isEmpty()) {
      List<Student> found = studentRepository.findAllById(dto.getStudentIds());
      if (found.size() != dto.getStudentIds().size()) {
        errors.put("students", "Nie znaleziono niektórych uczniów");
      }
      students.addAll(found);
    }

    if (!errors.isEmpty()) {
      throw new ConflictException(errors);
    }

    LocalTime start = parseToLocalTime(dto.getStartTime());
    LocalTime end = parseToLocalTime(dto.getEndTime());

    LocalDate validFrom = parseToLocalDate(dto.getValidFrom());
    LocalDate validTo =
        dto.getValidTo() != null && !dto.getValidTo().trim().isEmpty()
            ? parseToLocalDate(dto.getValidTo())
            : null;

    return ScheduleSlot.builder()
        .therapist(therapist)
        .room(room)
        .title(dto.getTitle())
        .studentClass(studentClass)
        .students(students)
        .startTime(start)
        .endTime(end)
        .validFrom(validFrom)
        .validTo(validTo)
        .dayOfWeek(DayOfWeek.of(dto.getDayOfWeek()))
        .isIndividual(students.size() == 1)
        .build();
  }

  // ------------------------- ENTITY -> DTO -------------------------
  public ScheduleSlotDto toDto(ScheduleSlot slot) {
    Set<Long> studentIds =
        slot.getStudents().stream().map(Student::getId).collect(Collectors.toSet());

    Long singleStudentId =
        slot.isIndividual() && !studentIds.isEmpty() ? studentIds.iterator().next() : null;

    return ScheduleSlotDto.builder()
        .id(slot.getId())
        .title(slot.getTitle())
        .therapistId(slot.getTherapist().getId())
        .roomId(slot.getRoom().getId())
        .studentClassId(slot.getStudentClass() != null ? slot.getStudentClass().getId() : null)
        .studentIds(studentIds)
        .studentId(singleStudentId)
        .startTime(slot.getStartTime().toString())
        .endTime(slot.getEndTime().toString())
        .validFrom(slot.getValidFrom().toString())
        .validTo(slot.getValidTo() != null ? slot.getValidTo().toString() : null)
        .dayOfWeek(slot.getDayOfWeek().getValue())
        .individual(slot.isIndividual())
        .build();
  }
}
