package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.CreateScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.service.ScheduleService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

  private final ScheduleService scheduleService;

  @GetMapping
  public List<ScheduleSlotDto> getAll(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate date) {
    return scheduleService.getAllScheduleSlots(date);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ScheduleSlotDto> getById(@PathVariable Long id) {
    return ResponseEntity.ok(scheduleService.getById(id));
  }

  @GetMapping("/therapist/{id}")
  public List<ScheduleSlotDto> getByTherapist(
      @PathVariable Long id,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate date) {
    return scheduleService.getScheduleForTherapist(id, date);
  }

  @GetMapping("/student/{id}")
  public List<ScheduleSlotDto> getByStudent(
      @PathVariable Long id,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate date) {
    return scheduleService.getScheduleForStudentDto(id, date);
  }

  @GetMapping("/class/{id}")
  public List<ScheduleSlotDto> getByClass(
      @PathVariable Long id,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          LocalDate date) {
    return scheduleService.getScheduleForClassDto(id, date);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ScheduleSlotDto> update(
      @PathVariable Long id, @RequestBody ScheduleSlotDto dto) {
    return ResponseEntity.ok(scheduleService.updateScheduleSlotForAllStudents(id, dto));
  }

  @PutMapping("/{id}/all")
  public ScheduleSlotDto updateForAll(@PathVariable Long id, @RequestBody ScheduleSlotDto dto) {
    return scheduleService.updateScheduleSlotForAllStudents(id, dto);
  }

  @PutMapping("/{id}/student/{studentId}")
  public ScheduleSlotDto updateForSingleStudent(
      @PathVariable Long id, @PathVariable Long studentId, @RequestBody ScheduleSlotDto dto) {
    return scheduleService.updateScheduleSlotForSingleStudent(id, studentId, dto);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    scheduleService.deleteScheduleSlot(id);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{id}/all")
  public void deleteForAll(@PathVariable Long id) {
    scheduleService.deleteScheduleSlotForAllStudents(id);
  }

  @DeleteMapping("/{id}/student/{studentId}")
  public void deleteForSingleStudent(@PathVariable Long id, @PathVariable Long studentId) {
    scheduleService.deleteScheduleSlotForSingleStudent(id, studentId);
  }

  @PostMapping("/{entityType}/{entityId}")
  public ResponseEntity<ScheduleSlotDto> createSlotForEntity(
      @PathVariable String entityType,
      @PathVariable Long entityId,
      @RequestBody CreateScheduleSlotDto dto) {
    switch (entityType.toLowerCase()) {
      case "student" -> dto.setStudentId(entityId);
      case "therapist" -> {}
      case "class" -> dto.setStudentClassId(entityId);
      default -> throw new IllegalArgumentException("Unknown entityType: " + entityType);
    }
    ScheduleSlotDto created = scheduleService.createScheduleSlot(dto);
    return ResponseEntity.ok(created);
  }

  @DeleteMapping("/{entityType}/{entityId}")
  public ResponseEntity<Void> clearScheduleForEntity(
      @PathVariable String entityType, @PathVariable Long entityId) {
    scheduleService.clearSchedule(entityId, entityType);
    return ResponseEntity.ok().build();
  }
}
