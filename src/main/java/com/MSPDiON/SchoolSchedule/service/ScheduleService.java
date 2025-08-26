package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.CreateScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.ScheduleMapper;
import com.MSPDiON.SchoolSchedule.exception.ConflictException;
import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.*;
import com.MSPDiON.SchoolSchedule.utils.ConflictMessageBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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

    public List<ScheduleSlotDto> getScheduleForTherapist(Long therapistId) {
        return scheduleSlotRepository.findByTherapistId(therapistId).stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    public List<ScheduleSlot> getScheduleForStudent(Long studentId) {
        return scheduleSlotRepository.findByStudents_Id(studentId);
    }

    public List<ScheduleSlot> getScheduleForClass(Long classId) {
        return scheduleSlotRepository.findByStudentClass_Id(classId);
    }

    private void validateSlot(ScheduleSlot slot) {
        List<String> errorMessages = new ArrayList<>();

        try {
            ensureTherapistHasClassOrStudents(slot);
        } catch (IllegalArgumentException e) {
            errorMessages.add(e.getMessage());
        }

        errorMessages.addAll(checkTherapistAvailability(slot));
        errorMessages.addAll(checkRoomAvailability(slot));
        errorMessages.addAll(checkStudentConflicts(slot));
        errorMessages.addAll(checkClassStudentConflicts(slot));

        if (!errorMessages.isEmpty()) {
            throw new ConflictException(String.join("\n", errorMessages));
        }
    }

    private void ensureTherapistHasClassOrStudents(ScheduleSlot slot) {
        boolean hasClass = slot.getStudentClass() != null;
        boolean hasStudents = slot.getStudents() != null && !slot.getStudents().isEmpty();

        if (!hasClass && !hasStudents) {
            throw new IllegalArgumentException("Terapeuta musi mieć przypisaną klasę lub przynajmniej jednego ucznia.");
        }
    }

    private List<String> checkTherapistAvailability(ScheduleSlot slot) {
        List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByTherapist(
                slot.getTherapist().getId(),
                slot.getStartTime(),
                slot.getEndTime()
        );

        conflicts.removeIf(c -> c.getId().equals(slot.getId()));

        if (conflicts.isEmpty()) return List.of();
        return List.of(ConflictMessageBuilder.buildTherapistConflictMessage(slot, conflicts));
    }

    private List<String> checkRoomAvailability(ScheduleSlot slot) {
        List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByRoom(
                slot.getRoom().getId(),
                slot.getStartTime(),
                slot.getEndTime()
        );

        conflicts.removeIf(c -> c.getId().equals(slot.getId()));

        if (conflicts.isEmpty()) return List.of();
        return List.of(ConflictMessageBuilder.buildRoomConflictMessage(slot, conflicts));
    }

    private List<String> checkStudentConflicts(ScheduleSlot slot) {
        List<String> messages = new ArrayList<>();
        if (slot.getStudents() == null) return messages;

        for (Student student : slot.getStudents()) {
            List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByStudent(
                    student.getId(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );

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
        List<Student> classStudents = studentRepository.findByStudentClass_Id(studentClass.getId());

        for (Student student : classStudents) {
            List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByStudent(
                    student.getId(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );

            conflicts.removeIf(c -> c.getId().equals(slot.getId()));

            if (!conflicts.isEmpty()) {
                messages.add("Uczeń " + student.getFirstName() + " " + student.getLastName()
                        + " z klasy " + studentClass.getName() + " ma konflikt w grafiku.");
            }
        }
        return messages;
    }


    public List<ScheduleSlotDto> getAllScheduleSlots() {
        return scheduleSlotRepository.findAll()
                .stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    public ScheduleSlotDto getById(Long id) {
        ScheduleSlot slot = scheduleSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule slot not found with id: " + id));
        return scheduleMapper.toDto(slot);
    }

    public List<ScheduleSlotDto> getScheduleForStudentDto(Long studentId) {
        return scheduleSlotRepository.findByStudents_Id(studentId)
                .stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    public List<ScheduleSlotDto> getScheduleForClassDto(Long classId) {
        return scheduleSlotRepository.findByStudentClass_Id(classId)
                .stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    public ScheduleSlotDto updateScheduleSlotForAllStudents(Long id, ScheduleSlotDto dto) {
        ScheduleSlot existing = scheduleSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule slot not found with id: " + id));

        ScheduleSlot updated = scheduleMapper.toEntity(dto);
        updated.setId(existing.getId());

        validateSlot(updated);
        return scheduleMapper.toDto(scheduleSlotRepository.save(updated));
    }

    public ScheduleSlotDto updateScheduleSlotForSingleStudent(Long id, Long studentId, ScheduleSlotDto dto) {
        ScheduleSlot existing = scheduleSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule slot not found with id: " + id));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

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
            throw new RuntimeException("Schedule slot not found with id: " + id);
        }
        scheduleSlotRepository.deleteById(id);
    }

    public void deleteScheduleSlotForAllStudents(Long id) {
        if (!scheduleSlotRepository.existsById(id)) {
            throw new RuntimeException("Schedule slot not found with id: " + id);
        }
        scheduleSlotRepository.deleteById(id);
    }

    public void deleteScheduleSlotForSingleStudent(Long slotId, Long studentId) {
        ScheduleSlot slot = scheduleSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Schedule slot not found with id: " + slotId));

        boolean removed = slot.getStudents().removeIf(s -> s.getId().equals(studentId));

        if (!removed)  throw new RuntimeException("Student with id " + studentId + " not found in this slot");


        if (slot.getStudents().isEmpty()) scheduleSlotRepository.delete(slot);
        else scheduleSlotRepository.save(slot);

    }

}
