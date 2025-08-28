package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.StudentClassDto;
import com.MSPDiON.SchoolSchedule.service.StudentClassService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class StudentClassController {

  private final StudentClassService studentClassService;

  @GetMapping
  public List<StudentClassDto> getAll() {
    return studentClassService.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<StudentClassDto> getById(@PathVariable Long id) {
    return ResponseEntity.ok(studentClassService.getById(id));
  }

  @PostMapping
  public ResponseEntity<StudentClassDto> create(@RequestBody StudentClassDto dto) {
    return ResponseEntity.ok(studentClassService.create(dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<StudentClassDto> update(
      @PathVariable Long id, @RequestBody StudentClassDto dto) {
    return ResponseEntity.ok(studentClassService.update(id, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    studentClassService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
