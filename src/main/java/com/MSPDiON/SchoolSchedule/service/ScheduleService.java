package com.MSPDiON.SchoolSchedule.service;

import static com.MSPDiON.SchoolSchedule.utils.ConflictMessageBuilder.buildPresenceConflictMessage;
import static com.MSPDiON.SchoolSchedule.utils.ConflictMessageBuilder.buildStudentClassConflictMessage;
import static com.MSPDiON.SchoolSchedule.utils.DateUtils.isTimeOverlap;

import com.MSPDiON.SchoolSchedule.dto.CreateScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.ScheduleMapper;
import com.MSPDiON.SchoolSchedule.exception.ConflictException;
import com.MSPDiON.SchoolSchedule.exception.ScheduleSlotNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentClassNotFoundException;
import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.*;
import com.MSPDiON.SchoolSchedule.utils.ConflictMessageBuilder;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleService {

  private final ScheduleSlotRepository scheduleSlotRepository;
  private final StudentRepository studentRepository;
  private final StudentClassRepository studentClassRepository;
  private final TherapistRepository therapistRepository;
  private final RoomRepository roomRepository;

  private final ScheduleMapper scheduleMapper;

  public ScheduleSlotDto createScheduleSlot(CreateScheduleSlotDto dto) {
    ScheduleSlot entity = scheduleMapper.toEntity(dto);
    validateSlot(entity);
    return scheduleMapper.toDto(scheduleSlotRepository.save(entity));
  }

  public List<ScheduleSlotDto> getScheduleForTherapist(Long therapistId, LocalDate date) {
    return scheduleSlotRepository.findByTherapistId(therapistId).stream()
        .filter(slot -> isSlotValidForDate(slot, date))
        .map(scheduleMapper::toDto)
        .toList();
  }

  public List<ScheduleSlot> getScheduleForStudent(Long studentId) {
    return scheduleSlotRepository.findByStudentId(studentId);
  }

  public List<ScheduleSlot> getScheduleForClass(Long classId) {
    return scheduleSlotRepository.findByStudentClassId(classId);
  }

  private void validateSlot(ScheduleSlot slot) {
    Map<String, String> errors = new HashMap<>();

    // Sprawdzenie, czy slot ma klasę lub uczniów
    try {
      ensureTherapistHasClassOrStudents(slot);
    } catch (IllegalArgumentException e) {
      errors.put("students", e.getMessage());
    }

    // Sprawdzenie dostępności terapeuty z uwzględnieniem dat
    List<String> therapistConflicts = checkTherapistAvailability(slot);
    if (!therapistConflicts.isEmpty()) {
      errors.put("therapist", String.join(", ", therapistConflicts));
    }

    // Sprawdzenie dostępności sali z uwzględnieniem dat
    List<String> roomConflicts = checkRoomAvailability(slot);
    if (!roomConflicts.isEmpty()) {
      errors.put("room", String.join(", ", roomConflicts));
    }

    // Konflikty uczniów z uwzględnieniem dat
    List<String> studentErrors = checkStudentConflicts(slot);
    if (!studentErrors.isEmpty()) {
      errors.put("students", String.join(", ", studentErrors));
    }

    // Konflikty klasy z uwzględnieniem dat
    List<String> classErrors = checkClassStudentConflicts(slot);
    if (!classErrors.isEmpty()) {
      errors.put("studentClass", String.join(", ", classErrors));
    }

    // Sprawdzenie obecności uczniów w ciągu dnia
    List<String> presenceErrors = checkStudentDailyPresence(slot);
    if (!presenceErrors.isEmpty()) {
      errors.put("students", String.join(", ", presenceErrors));
    }

    // Sprawdzenie dat obowiązywania
    if (slot.getValidFrom() == null) {
      errors.put("validFrom", "Data rozpoczęcia obowiązywania slotu jest wymagana");
    } else if (slot.getValidTo() != null && slot.getValidFrom().isAfter(slot.getValidTo())) {
      errors.put("validTo", "Data zakończenia nie może być przed datą rozpoczęcia");
    }

    List<ScheduleSlot> relatedSlots = new ArrayList<>();
    if (slot.getStudentClass() != null) {
      relatedSlots.addAll(
          scheduleSlotRepository.findByStudentClassId(slot.getStudentClass().getId()));
    }
    if (slot.getStudents() != null) {
      for (Student student : slot.getStudents()) {
        relatedSlots.addAll(scheduleSlotRepository.findByStudentId(student.getId()));
      }
    }
    for (ScheduleSlot existing : relatedSlots) {
      if (existing.getId().equals(slot.getId())) continue;
      if (areSlotsOverlapping(slot, existing)) {
        errors.put(
            "startTime",
            "Godziny slotu kolidują z istniejącym slotem w tym samym dniu tygodnia i okresie obowiązywania.");
      }
    }

    if (!errors.isEmpty()) {
      throw new ConflictException(errors);
    }
  }

  private boolean areSlotsOverlapping(ScheduleSlot slot1, ScheduleSlot slot2) {
    LocalDate slot1From = slot1.getValidFrom();
    LocalDate slot1To = slot1.getValidTo() != null ? slot1.getValidTo() : LocalDate.MAX;
    LocalDate slot2From = slot2.getValidFrom();
    LocalDate slot2To = slot2.getValidTo() != null ? slot2.getValidTo() : LocalDate.MAX;

    if (slot1To.isBefore(slot2From) || slot1From.isAfter(slot2To)) return false;

    if (!slot1.getDayOfWeek().equals(slot2.getDayOfWeek())) return false;

    return isTimeOverlap(
        slot1.getStartTime(), slot1.getEndTime(), slot2.getStartTime(), slot2.getEndTime());
  }

  private List<String> checkStudentDailyPresence(ScheduleSlot slot) {
    List<String> messages = new ArrayList<>();
    if (slot.getStudents() == null && slot.getStudentClass() == null) return messages;

    List<Student> studentsToCheck = new ArrayList<>();

    if (slot.getStudentClass() != null) {
      studentsToCheck.addAll(
          studentRepository.findByStudentClassId(slot.getStudentClass().getId()));
    }

    if (slot.getStudents() != null) {
      studentsToCheck.addAll(slot.getStudents());
    }

    for (Student student : studentsToCheck) {
      checkPresenceForStudent(slot, student).ifPresent(messages::add);
    }

    return messages;
  }

  private Optional<String> checkPresenceForStudent(ScheduleSlot slot, Student student) {
    if (student.getArrivalTime() == null || student.getDepartureTime() == null) {
      return Optional.empty();
    }

    if (slot.getStartTime().isBefore(student.getArrivalTime())
        || slot.getEndTime().isAfter(student.getDepartureTime())) {
      return Optional.of(buildPresenceConflictMessage(student));
    }

    return Optional.empty();
  }

  private void ensureTherapistHasClassOrStudents(ScheduleSlot slot) {
    boolean hasClass = slot.getStudentClass() != null;
    boolean hasStudents = slot.getStudents() != null && !slot.getStudents().isEmpty();

    if (!hasClass && !hasStudents) {
      throw new IllegalArgumentException(
          "Terapeuta musi mieć przypisaną klasę lub przynajmniej jednego ucznia.");
    }
  }

  private List<String> checkTherapistAvailability(ScheduleSlot slot) {
    List<ScheduleSlot> conflicts =
        scheduleSlotRepository.findConflictsByTherapist(
            slot.getTherapist().getId(),
            slot.getDayOfWeek(),
            slot.getStartTime(),
            slot.getEndTime());

    conflicts.removeIf(c -> c.getId().equals(slot.getId()));

    if (conflicts.isEmpty()) return List.of();
    return List.of(ConflictMessageBuilder.buildTherapistConflictMessage(slot, conflicts));
  }

  private List<String> checkRoomAvailability(ScheduleSlot slot) {
    List<ScheduleSlot> conflicts =
        scheduleSlotRepository.findConflictsByRoom(
            slot.getRoom().getId(), slot.getDayOfWeek(), slot.getStartTime(), slot.getEndTime());

    conflicts.removeIf(c -> c.getId().equals(slot.getId()));

    if (conflicts.isEmpty()) return List.of();
    return List.of(ConflictMessageBuilder.buildRoomConflictMessage(slot, conflicts));
  }

  private List<String> checkStudentConflicts(ScheduleSlot slot) {
    List<String> messages = new ArrayList<>();
    if (slot.getStudents() == null) return messages;

    for (Student student : slot.getStudents()) {
      List<ScheduleSlot> conflicts =
          scheduleSlotRepository.findConflictsByStudent(
              student.getId(), slot.getDayOfWeek(), slot.getStartTime(), slot.getEndTime());

      conflicts.removeIf(c -> c.getId().equals(slot.getId()));

      if (!conflicts.isEmpty()) {
        messages.add(ConflictMessageBuilder.buildStudentConflictMessage(student, conflicts));
      }
    }
    return messages;
  }

  private List<String> checkClassStudentConflicts(ScheduleSlot slot) {
    List<String> messages = new ArrayList<>();
    if (slot.getStudentClass() == null) return messages;

    StudentClass studentClass = slot.getStudentClass();
    List<Student> classStudents = studentRepository.findByStudentClassId(studentClass.getId());

    for (Student student : classStudents) {
      checkConflictsForStudent(slot, student, studentClass).ifPresent(messages::add);
    }

    return messages;
  }

  private Optional<String> checkConflictsForStudent(
      ScheduleSlot slot, Student student, StudentClass studentClass) {
    List<ScheduleSlot> conflicts =
        scheduleSlotRepository.findConflictsByStudent(
            student.getId(), slot.getDayOfWeek(), slot.getStartTime(), slot.getEndTime());

    conflicts.removeIf(c -> c.getId().equals(slot.getId()));

    if (!conflicts.isEmpty()) {
      return Optional.of(buildStudentClassConflictMessage(student, studentClass));
    }
    return Optional.empty();
  }

  public List<ScheduleSlotDto> getAllScheduleSlots(LocalDate date) {
    return scheduleSlotRepository.findAll().stream()
        .filter(slot -> isSlotValidForDate(slot, date))
        .map(scheduleMapper::toDto)
        .toList();
  }

  public ScheduleSlotDto getById(Long id) {
    ScheduleSlot slot =
        scheduleSlotRepository
            .findById(id)
            .orElseThrow(() -> new ScheduleSlotNotFoundException(id));
    return scheduleMapper.toDto(slot);
  }

  public List<ScheduleSlotDto> getScheduleForStudentDto(Long studentId, LocalDate date) {
    return scheduleSlotRepository.findByStudentId(studentId).stream()
        .filter(slot -> isSlotValidForDate(slot, date))
        .map(scheduleMapper::toDto)
        .toList();
  }

  public List<ScheduleSlotDto> getScheduleForClassDto(Long classId, LocalDate date) {
    return scheduleSlotRepository.findByStudentClassId(classId).stream()
        .filter(slot -> isSlotValidForDate(slot, date))
        .map(scheduleMapper::toDto)
        .toList();
  }

  private boolean isSlotValidForDate(ScheduleSlot slot, LocalDate date) {
    if (date == null) return true;
    if (slot.getValidFrom() != null && slot.getValidFrom().isAfter(date)) return false;
    return slot.getValidTo() == null || !slot.getValidTo().isBefore(date);
  }

  public ScheduleSlotDto updateScheduleSlotForAllStudents(Long id, ScheduleSlotDto dto) {
    ScheduleSlot existing =
        scheduleSlotRepository
            .findById(id)
            .orElseThrow(() -> new ScheduleSlotNotFoundException(id));

    ScheduleSlot updated = scheduleMapper.toEntity(dto);
    updated.setId(existing.getId());

    validateSlot(updated);
    return scheduleMapper.toDto(scheduleSlotRepository.save(updated));
  }

  public ScheduleSlotDto updateScheduleSlotForSingleStudent(
      Long id, Long studentId, ScheduleSlotDto dto) {
    ScheduleSlot existing =
        scheduleSlotRepository
            .findById(id)
            .orElseThrow(() -> new ScheduleSlotNotFoundException(id));

    Student student =
        studentRepository
            .findById(studentId)
            .orElseThrow(() -> new StudentClassNotFoundException(studentId));

    existing.getStudents().removeIf(s -> s.getId().equals(studentId));
    scheduleSlotRepository.save(existing);

    ScheduleSlot newSlot = scheduleMapper.toEntity(dto);
    newSlot.setId(null);
    newSlot.setStudents(Set.of(student));

    validateSlot(newSlot);
    return scheduleMapper.toDto(scheduleSlotRepository.save(newSlot));
  }

  public void deleteScheduleSlot(Long id) {
    if (!scheduleSlotRepository.existsById(id)) {
      throw new ScheduleSlotNotFoundException(id);
    }
    scheduleSlotRepository.deleteById(id);
  }

  public void deleteScheduleSlotForAllStudents(Long id) {
    if (!scheduleSlotRepository.existsById(id)) {
      throw new ScheduleSlotNotFoundException(id);
    }
    scheduleSlotRepository.deleteById(id);
  }

  public void deleteScheduleSlotForSingleStudent(Long slotId, Long studentId) {
    ScheduleSlot slot =
        scheduleSlotRepository
            .findById(slotId)
            .orElseThrow(() -> new ScheduleSlotNotFoundException(slotId));

    boolean removed = slot.getStudents().removeIf(s -> s.getId().equals(studentId));

    if (!removed)
      throw new RuntimeException("Student with id " + studentId + " not found in this slot");

    if (slot.getStudents().isEmpty()) scheduleSlotRepository.delete(slot);
    else scheduleSlotRepository.save(slot);
  }

  @Transactional
  public void clearSchedule(Long entityId, String entityType) {
    switch (entityType.toLowerCase()) {
      case "student":
        clearStudentSlots(entityId);
        break;
      case "therapist":
        clearTherapistSlots(entityId);
        break;
      case "class":
        clearClassSlots(entityId);
        break;
      default:
        throw new IllegalArgumentException("Unknown entityType: " + entityType);
    }
  }

  private void clearStudentSlots(Long studentId) {
    List<ScheduleSlot> slots = scheduleSlotRepository.findByStudentId(studentId);

    for (ScheduleSlot slot : slots) {
      if (slot.getStudents().size() == 1) {
        scheduleSlotRepository.delete(slot);
      } else if (slot.getStudentClass() != null) {
        continue;
      } else {
        slot.getStudents().removeIf(s -> s.getId().equals(studentId));
        scheduleSlotRepository.save(slot);
      }
    }
  }

  private void clearTherapistSlots(Long therapistId) {
    List<ScheduleSlot> slots = scheduleSlotRepository.findByTherapistId(therapistId);
    scheduleSlotRepository.deleteAll(slots);
  }

  private void clearClassSlots(Long classId) {
    List<ScheduleSlot> slots = scheduleSlotRepository.findByStudentClassId(classId);
    scheduleSlotRepository.deleteAll(slots);
  }
}
