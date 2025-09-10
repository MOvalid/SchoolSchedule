package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistAvailabilityDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.service.TherapistService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

  // ---- Therapist Availability ----

  @GetMapping("/{id}/availabilities")
  public List<TherapistAvailabilityDto> getAvailabilities(@PathVariable Long id) {
    return therapistService.getAvailabilities(id);
  }

  @PostMapping("/{id}/availabilities")
  public ResponseEntity<TherapistAvailabilityDto> addAvailability(
      @PathVariable Long id, @RequestBody TherapistAvailabilityDto dto) {
    return ResponseEntity.ok(therapistService.addAvailability(id, dto));
  }

  @PutMapping("/{id}/availabilities/{availabilityId}")
  public ResponseEntity<TherapistAvailabilityDto> updateAvailability(
      @PathVariable Long id,
      @PathVariable Long availabilityId,
      @RequestBody TherapistAvailabilityDto dto) {
    return ResponseEntity.ok(therapistService.updateAvailability(id, availabilityId, dto));
  }

  @DeleteMapping("/{id}/availabilities/{availabilityId}")
  public ResponseEntity<Void> deleteAvailability(
      @PathVariable Long id, @PathVariable Long availabilityId) {
    therapistService.deleteAvailability(id, availabilityId);
    return ResponseEntity.noContent().build();
  }
}
