package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.model.*;
import com.MSPDiON.SchoolSchedule.repository.RoomRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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
            students = new HashSet<Student>(studentRepository.findAllById(dto.getStudentIds()));
        }

        return ScheduleSlot.builder()
                .id(dto.getId())
                .therapist(therapist)
                .room(room)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .studentClass(studentClass)
                .students(students)
                .isIndividual(dto.isIndividual())
                .build();
    }

    public ScheduleSlotDto toDto(ScheduleSlot slot) {
        Set<Long> studentIds = slot.getStudents().stream()
                .map(Student::getId)
                .collect(Collectors.toSet());

        return ScheduleSlotDto.builder()
                .id(slot.getId())
                .therapistId(slot.getTherapist().getId())
                .roomId(slot.getRoom().getId())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .studentClassId(slot.getStudentClass() != null ? slot.getStudentClass().getId() : null)
                .studentIds(studentIds)
                .individual(slot.isIndividual())
                .build();
    }
}

