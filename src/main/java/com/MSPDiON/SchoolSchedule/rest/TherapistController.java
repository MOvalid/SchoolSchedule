package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.AvailabilityDto;
import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.service.AvailabilityService;
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
  private final AvailabilityService availabilityService;

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
  public List<AvailabilityDto> getAvailabilities(@PathVariable Long id) {
    return availabilityService.getAvailabilities(id, "THERAPIST");
  }

  @PostMapping("/{id}/availabilities")
  public ResponseEntity<AvailabilityDto> addAvailability(
      @PathVariable Long id, @RequestBody AvailabilityDto dto) {
    return ResponseEntity.ok(availabilityService.addAvailability(id, "THERAPIST", dto));
  }

  @PutMapping("/{id}/availabilities/{availabilityId}")
  public ResponseEntity<AvailabilityDto> updateAvailability(
      @PathVariable Long id, @PathVariable Long availabilityId, @RequestBody AvailabilityDto dto) {
    return ResponseEntity.ok(
        availabilityService.updateAvailability(id, "THERAPIST", availabilityId, dto));
  }

  @DeleteMapping("/{id}/availabilities/{availabilityId}")
  public ResponseEntity<Void> deleteAvailability(
      @PathVariable Long id, @PathVariable Long availabilityId) {
    availabilityService.deleteAvailability(id, "THERAPIST", availabilityId);
    return ResponseEntity.noContent().build();
  }
}
