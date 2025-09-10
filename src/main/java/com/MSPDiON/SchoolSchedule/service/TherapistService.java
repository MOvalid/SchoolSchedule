package com.MSPDiON.SchoolSchedule.service;

import static com.MSPDiON.SchoolSchedule.dto.mapper.TherapistMapper.toAvailabilityDto;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistAvailabilityDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.TherapistMapper;
import com.MSPDiON.SchoolSchedule.exception.TherapistAvailabilityNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.TherapistNotAvailableException;
import com.MSPDiON.SchoolSchedule.exception.TherapistNotFoundException;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.model.TherapistAvailability;
import com.MSPDiON.SchoolSchedule.repository.TherapistAvailabilityRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TherapistService {

  private final TherapistRepository therapistRepository;
  private final TherapistAvailabilityRepository availabilityRepository;
  private final TherapistMapper therapistMapper;

  public List<TherapistDto> getAll() {
    return therapistRepository.findAll().stream().map(therapistMapper::toDto).toList();
  }

  public TherapistDto getById(Long id) {
    return therapistRepository
        .findById(id)
        .map(therapistMapper::toDto)
        .orElseThrow(() -> new TherapistNotFoundException(id));
  }

  public TherapistDto create(CreateTherapistDto dto) {
    Therapist saved = therapistRepository.save(therapistMapper.toEntity(dto));
    return therapistMapper.toDto(saved);
  }

  public TherapistDto update(Long id, TherapistDto dto) {
    Therapist existing =
        therapistRepository.findById(id).orElseThrow(() -> new TherapistNotFoundException(id));
    existing.setFirstName(dto.getFirstName());
    existing.setLastName(dto.getLastName());
    existing.setRole(dto.getRole());
    existing.setDepartments(dto.getDepartments());
    return therapistMapper.toDto(therapistRepository.save(existing));
  }

  public void delete(Long id) {
    therapistRepository.deleteById(id);
  }

  // ---------------- Therapist Availability ----------------

  public List<TherapistAvailabilityDto> getAvailabilities(Long therapistId) {
    Therapist therapist =
        therapistRepository
            .findById(therapistId)
            .orElseThrow(() -> new TherapistNotFoundException(therapistId));
    return therapistMapper.mapAvailabilities(therapist.getAvailabilities());
  }

  public TherapistAvailabilityDto addAvailability(Long therapistId, TherapistAvailabilityDto dto) {
    Therapist therapist =
        therapistRepository
            .findById(therapistId)
            .orElseThrow(() -> new TherapistNotFoundException(therapistId));

    validateAvailabilityConflict(therapist, dto, null);

    TherapistAvailability newAvailability =
        TherapistAvailability.builder()
            .therapist(therapist)
            .dayOfWeek(dto.getDayOfWeek())
            .startTime(LocalTime.parse(dto.getStartTime()))
            .endTime(LocalTime.parse(dto.getEndTime()))
            .build();

    availabilityRepository.save(newAvailability);
    therapist.getAvailabilities().add(newAvailability);
    therapistRepository.save(therapist);

    return toAvailabilityDto(newAvailability);
  }

  public TherapistAvailabilityDto updateAvailability(
      Long therapistId, Long availabilityId, TherapistAvailabilityDto dto) {
    Therapist therapist =
        therapistRepository
            .findById(therapistId)
            .orElseThrow(() -> new TherapistNotFoundException(therapistId));

    TherapistAvailability existing =
        availabilityRepository
            .findById(availabilityId)
            .orElseThrow(() -> new TherapistAvailabilityNotFoundException(availabilityId));

    validateAvailabilityConflict(therapist, dto, existing);

    existing.setDayOfWeek(dto.getDayOfWeek());
    existing.setStartTime(LocalTime.parse(dto.getStartTime()));
    existing.setEndTime(LocalTime.parse(dto.getEndTime()));

    availabilityRepository.save(existing);
    return toAvailabilityDto(existing);
  }

  public void deleteAvailability(Long therapistId, Long availabilityId) {
    Therapist therapist =
        therapistRepository
            .findById(therapistId)
            .orElseThrow(() -> new TherapistNotFoundException(therapistId));

    TherapistAvailability existing =
        availabilityRepository
            .findById(availabilityId)
            .orElseThrow(
                () -> new RuntimeException("Availability not found with id: " + availabilityId));

    therapist.getAvailabilities().removeIf(a -> a.getId().equals(availabilityId));
    therapistRepository.save(therapist);
    availabilityRepository.delete(existing);
  }

  // ---------------- Private ----------------

  private void validateAvailabilityConflict(
      Therapist therapist, TherapistAvailabilityDto dto, TherapistAvailability exclude) {
    Optional<TherapistAvailability> conflict =
        therapist.getAvailabilities().stream()
            .filter(a -> !a.equals(exclude))
            .filter(a -> a.getDayOfWeek() == dto.getDayOfWeek())
            .filter(
                a ->
                    a.getStartTime().isBefore(LocalTime.parse(dto.getEndTime()))
                        && a.getEndTime().isAfter(LocalTime.parse(dto.getStartTime())))
            .findAny();

    if (conflict.isPresent()) {
      throw new TherapistNotAvailableException(therapist);
    }
  }
}
