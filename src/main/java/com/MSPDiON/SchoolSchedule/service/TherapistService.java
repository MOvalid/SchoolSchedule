package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.TherapistMapper;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TherapistService {

  private final TherapistRepository therapistRepository;
  private final TherapistMapper therapistMapper;

  public List<TherapistDto> getAll() {
    return therapistRepository.findAll().stream().map(therapistMapper::toDto).toList();
  }

  public TherapistDto getById(Long id) {
    return therapistRepository
        .findById(id)
        .map(therapistMapper::toDto)
        .orElseThrow(() -> new RuntimeException("Therapist not found"));
  }

  public TherapistDto create(CreateTherapistDto dto) {
    Therapist saved = therapistRepository.save(therapistMapper.toEntity(dto));
    return therapistMapper.toDto(saved);
  }

  public TherapistDto update(Long id, TherapistDto dto) {
    Therapist existing =
        therapistRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Therapist not found"));
    existing.setFirstName(dto.getFirstName());
    existing.setLastName(dto.getLastName());
    existing.setRole(dto.getRole());
    existing.setDepartments(dto.getDepartments());
    return therapistMapper.toDto(therapistRepository.save(existing));
  }

  public void delete(Long id) {
    therapistRepository.deleteById(id);
  }
}
