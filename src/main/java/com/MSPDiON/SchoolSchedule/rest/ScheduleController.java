package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.CreateScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

//    @PostMapping
//    public ResponseEntity<ScheduleSlotDto> create(@RequestBody ScheduleSlotDto dto) {
//        return ResponseEntity.ok(scheduleService.createScheduleSlot(dto));
//    }

    @GetMapping
    public List<ScheduleSlotDto> getAll() {
        return scheduleService.getAllScheduleSlots();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleSlotDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getById(id));
    }

    @GetMapping("/therapist/{id}")
    public List<ScheduleSlotDto> getByTherapist(@PathVariable Long id) {
        return scheduleService.getScheduleForTherapist(id);
    }

    @GetMapping("/student/{id}")
    public List<ScheduleSlotDto> getByStudent(@PathVariable Long id) {
        return scheduleService.getScheduleForStudentDto(id);
    }

    @GetMapping("/class/{id}")
    public List<ScheduleSlotDto> getByClass(@PathVariable Long id) {
        return scheduleService.getScheduleForClassDto(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleSlotDto> update(@PathVariable Long id, @RequestBody ScheduleSlotDto dto) {
        return ResponseEntity.ok(scheduleService.updateScheduleSlotForAllStudents(id, dto));
    }

    @PutMapping("/{id}/all")
    public ScheduleSlotDto updateForAll(
            @PathVariable Long id,
            @RequestBody ScheduleSlotDto dto
    ) {
        return scheduleService.updateScheduleSlotForAllStudents(id, dto);
    }

    @PutMapping("/{id}/student/{studentId}")
    public ScheduleSlotDto updateForSingleStudent(
            @PathVariable Long id,
            @PathVariable Long studentId,
            @RequestBody ScheduleSlotDto dto
    ) {
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
    public void deleteForSingleStudent(
            @PathVariable Long id,
            @PathVariable Long studentId
    ) {
        scheduleService.deleteScheduleSlotForSingleStudent(id, studentId);
    }

    @PostMapping("/student/{id}")
    public ResponseEntity<ScheduleSlotDto> createSlotForStudent(@PathVariable Long id, @RequestBody CreateScheduleSlotDto dto) {
        dto.setStudentId(id);
        System.out.println(dto);
        ScheduleSlotDto created = scheduleService.createScheduleSlot(dto);
        return ResponseEntity.ok(created);
    }

}
