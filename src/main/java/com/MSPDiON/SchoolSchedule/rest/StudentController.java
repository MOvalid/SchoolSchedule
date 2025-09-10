package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.AvailabilityDto;
import com.MSPDiON.SchoolSchedule.dto.CreateStudentDto;
import com.MSPDiON.SchoolSchedule.dto.StudentDto;
import com.MSPDiON.SchoolSchedule.service.AvailabilityService;
import com.MSPDiON.SchoolSchedule.service.StudentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

  private final StudentService studentService;
  private final AvailabilityService availabilityService;

  @PostMapping
  public StudentDto create(@RequestBody CreateStudentDto dto) {
    return studentService.create(dto);
  }

  @GetMapping
  public List<StudentDto> getAll() {
    return studentService.getAll();
  }

  @GetMapping("/sorted")
  public List<StudentDto> getAllSortedByLastName() {
    return studentService.getAllSortedByLastName();
  }

  @GetMapping("/by-class/{classId}")
  public List<StudentDto> getAllByClassId(@PathVariable Long classId) {
    return studentService.getAllByClassId(classId);
  }

  @GetMapping("/{id}")
  public StudentDto getById(@PathVariable Long id) {
    return studentService.getById(id);
  }

  @PutMapping("/{id}")
  public StudentDto update(@PathVariable Long id, @RequestBody StudentDto dto) {
    return studentService.update(id, dto);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    studentService.delete(id);
  }

  // ---- Student Availability ----

  @GetMapping("/{id}/availabilities")
  public List<AvailabilityDto> getAvailabilities(@PathVariable Long id) {
    return availabilityService.getAvailabilities(id, "STUDENT");
  }

  @PostMapping("/{id}/availabilities")
  public ResponseEntity<AvailabilityDto> addAvailability(
      @PathVariable Long id, @RequestBody AvailabilityDto dto) {
    return ResponseEntity.ok(availabilityService.addAvailability(id, "STUDENT", dto));
  }

  @PutMapping("/{id}/availabilities/{availabilityId}")
  public ResponseEntity<AvailabilityDto> updateAvailability(
      @PathVariable Long id, @PathVariable Long availabilityId, @RequestBody AvailabilityDto dto) {
    return ResponseEntity.ok(
        availabilityService.updateAvailability(id, "STUDENT", availabilityId, dto));
  }

  @DeleteMapping("/{id}/availabilities/{availabilityId}")
  public ResponseEntity<Void> deleteAvailability(
      @PathVariable Long id, @PathVariable Long availabilityId) {
    availabilityService.deleteAvailability(id, "STUDENT", availabilityId);
    return ResponseEntity.noContent().build();
  }
}
