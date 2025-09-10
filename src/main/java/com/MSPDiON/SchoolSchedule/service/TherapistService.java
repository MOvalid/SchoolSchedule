package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.TherapistMapper;
import com.MSPDiON.SchoolSchedule.exception.TherapistNotFoundException;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.repository.AvailabilityRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TherapistService {

  private final TherapistRepository therapistRepository;
  private final AvailabilityRepository availabilityRepository;
  private final TherapistMapper therapistMapper;
  private final AvailabilityService availabilityService;

  public List<TherapistDto> getAll() {
    return therapistRepository.findAll().stream()
        .map(
            t ->
                therapistMapper.toDto(
                    t, availabilityRepository.findByEntityIdAndEntityType(t.getId(), "THERAPIST")))
        .toList();
  }

  public TherapistDto getById(Long id) {
    Therapist therapist =
        therapistRepository.findById(id).orElseThrow(() -> new TherapistNotFoundException(id));

    return therapistMapper.toDto(
        therapist,
        availabilityRepository.findByEntityIdAndEntityType(therapist.getId(), "THERAPIST"));
  }

  public TherapistDto create(CreateTherapistDto dto) {
    Therapist saved = therapistRepository.save(therapistMapper.toEntity(dto));
    return therapistMapper.toDto(
        saved, availabilityRepository.findByEntityIdAndEntityType(saved.getId(), "THERAPIST"));
  }

  public TherapistDto update(Long id, TherapistDto dto) {
    Therapist existing =
        therapistRepository.findById(id).orElseThrow(() -> new TherapistNotFoundException(id));

    existing.setFirstName(dto.getFirstName());
    existing.setLastName(dto.getLastName());
    existing.setRole(dto.getRole());
    existing.setDepartments(dto.getDepartments());

    Therapist updated = therapistRepository.save(existing);
    return therapistMapper.toDto(
        updated, availabilityRepository.findByEntityIdAndEntityType(updated.getId(), "THERAPIST"));
  }

  public void delete(Long id) {
    therapistRepository.deleteById(id);
  }
}
