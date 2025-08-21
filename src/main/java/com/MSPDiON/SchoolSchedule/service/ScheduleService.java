package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.ScheduleMapper;
import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleSlotRepository scheduleSlotRepository;
    private final StudentRepository studentRepository;
    private final StudentClassRepository studentClassRepository;
    private final TherapistRepository therapistRepository;
    private final RoomRepository roomRepository;

    private final ScheduleMapper scheduleMapper;

    public ScheduleSlotDto createScheduleSlot(ScheduleSlotDto dto) {
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
        ensureTherapistHasClassOrStudents(slot);
        checkTherapistAvailability(slot);
        checkRoomAvailability(slot);
        checkStudentConflicts(slot);
        checkClassStudentConflicts(slot);
    }

    private void ensureTherapistHasClassOrStudents(ScheduleSlot slot) {
        boolean hasClass = slot.getStudentClass() != null;
        boolean hasStudents = slot.getStudents() != null && !slot.getStudents().isEmpty();

        if (!hasClass && !hasStudents) {
            throw new IllegalArgumentException("Therapist must have either a whole class or at least one student.");
        }
    }

    private void checkTherapistAvailability(ScheduleSlot slot) {
        List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByTherapist(
                slot.getTherapist().getId(),
                slot.getStartTime(),
                slot.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Therapist has a scheduling conflict.");
        }
    }

    private void checkRoomAvailability(ScheduleSlot slot) {
        List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByRoom(
                slot.getRoom().getId(),
                slot.getStartTime(),
                slot.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Room is occupied at the requested time.");
        }
    }

    private void checkStudentConflicts(ScheduleSlot slot) {
        if (slot.getStudents() == null) return;

        for (Student student : slot.getStudents()) {
            List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByStudent(
                    student.getId(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );
            if (!conflicts.isEmpty()) {
                throw new IllegalArgumentException("Student " + student.getFirstName() + " has a scheduling conflict.");
            }
        }
    }

    private void checkClassStudentConflicts(ScheduleSlot slot) {
        if (slot.getStudentClass() == null) return;

        StudentClass studentClass = slot.getStudentClass();
        List<Student> classStudents = studentRepository.findByStudentClass_Id(studentClass.getId());

        for (Student student : classStudents) {
            List<ScheduleSlot> conflicts = scheduleSlotRepository.findConflictsByStudent(
                    student.getId(),
                    slot.getStartTime(),
                    slot.getEndTime()
            );
            if (!conflicts.isEmpty()) {
                throw new IllegalArgumentException("Student " + student.getFirstName()
                        + " from class " + studentClass.getName() + " has a scheduling conflict.");
            }
        }
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

    public ScheduleSlotDto updateScheduleSlot(Long id, ScheduleSlotDto dto) {
        ScheduleSlot existing = scheduleSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule slot not found with id: " + id));

        ScheduleSlot updated = scheduleMapper.toEntity(dto);
        updated.setId(existing.getId());  // zachowaj ID

        validateSlot(updated);
        ScheduleSlot saved = scheduleSlotRepository.save(updated);
        return scheduleMapper.toDto(saved);
    }

    public void deleteScheduleSlot(Long id) {
        if (!scheduleSlotRepository.existsById(id)) {
            throw new RuntimeException("Schedule slot not found with id: " + id);
        }
        scheduleSlotRepository.deleteById(id);
    }
}
