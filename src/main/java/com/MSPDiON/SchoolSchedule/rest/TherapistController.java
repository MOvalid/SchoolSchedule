package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.service.TherapistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/therapists")
@RequiredArgsConstructor
public class TherapistController {

    private final TherapistService therapistService;

    @GetMapping
    public List<TherapistDto> getAll() {
        return therapistService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TherapistDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(therapistService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TherapistDto> create(@RequestBody CreateTherapistDto dto) {
        return ResponseEntity.ok(therapistService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TherapistDto> update(@PathVariable Long id, @RequestBody TherapistDto dto) {
        return ResponseEntity.ok(therapistService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        therapistService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
