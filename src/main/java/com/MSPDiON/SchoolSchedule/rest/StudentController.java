package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.StudentDto;
import com.MSPDiON.SchoolSchedule.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public StudentDto create(@RequestBody StudentDto dto) {
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
}
