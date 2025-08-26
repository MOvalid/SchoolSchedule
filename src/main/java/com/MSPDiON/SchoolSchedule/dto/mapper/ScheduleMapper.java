package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.CreateScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.model.*;
import com.MSPDiON.SchoolSchedule.repository.RoomRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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

        LocalTime start = parseToLocalTime(dto.getStartTime());
        LocalTime end = parseToLocalTime(dto.getEndTime());

        return ScheduleSlot.builder()
                .id(dto.getId())
                .therapist(therapist)
                .room(room)
                .startTime(start)
                .endTime(end)
                .dayOfWeek(DayOfWeek.of(dto.getDayOfWeek()))
                .studentClass(studentClass)
                .students(students)
                .isIndividual(dto.isIndividual())
                .build();
    }

    public LocalTime parseToLocalTime(String isoDateTime) {
        return OffsetDateTime.parse(isoDateTime, DateTimeFormatter.ISO_DATE_TIME)
                .toLocalTime();
    }

    public ScheduleSlot toEntity(CreateScheduleSlotDto dto) {
        if (dto.getTherapistId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Therapist ID is required");
        if (dto.getStudentId() == null){
            if (dto.getStudentIds() != null && !dto.getStudentIds().isEmpty()){
                dto.setStudentId(dto.getStudentIds().getFirst());
            }
            else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student ID is required");
        }
        if (dto.getRoomId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room ID is required");

        Therapist therapist = therapistRepository.findById(dto.getTherapistId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Therapist not found"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room not found"));

        StudentClass studentClass = null;
        if (dto.getStudentClassId() != null) {
            studentClass = studentClassRepository.findById(dto.getStudentClassId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student class not found"));
        }

        Set<Student> students = new HashSet<>();
        if (dto.getStudentId() != null) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student not found"));
            students.add(student);
        }

        LocalTime start = parseToLocalTime(dto.getStartTime());
        LocalTime end = parseToLocalTime(dto.getEndTime());

        return ScheduleSlot.builder()
                .therapist(therapist)
                .room(room)
                .studentClass(studentClass)
                .students(students)
                .startTime(start)
                .endTime(end)
                .dayOfWeek(DayOfWeek.of(dto.getDayOfWeek()))
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
                .startTime(slot.getStartTime().toString())
                .endTime(slot.getEndTime().toString())
                .dayOfWeek(slot.getDayOfWeek().getValue())
                .studentClassId(slot.getStudentClass() != null ? slot.getStudentClass().getId() : null)
                .studentIds(studentIds)
                .individual(slot.isIndividual())
                .build();
    }
}

