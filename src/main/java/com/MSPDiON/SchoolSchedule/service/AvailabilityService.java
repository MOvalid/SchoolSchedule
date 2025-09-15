package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.AvailabilityDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.AvailabilityMapper;
import com.MSPDiON.SchoolSchedule.exception.AvailabilityNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.EntityNotAvailableException;
import com.MSPDiON.SchoolSchedule.model.Availability;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.repository.AvailabilityRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

  private final AvailabilityRepository availabilityRepository;
  private final StudentRepository studentRepository;
  private final AvailabilityMapper availabilityMapper;

  public List<AvailabilityDto> getAvailabilities(Long entityId, String entityType) {
    List<Availability> availabilities =
        availabilityRepository.findByEntityIdAndEntityType(entityId, entityType);

    if ("STUDENT".equalsIgnoreCase(entityType)) {
      Student student =
          studentRepository
              .findById(entityId)
              .orElseThrow(() -> new RuntimeException("Student not found: " + entityId));

      LocalTime arrival = student.getArrivalTime();
      LocalTime departure = student.getDepartureTime();

      availabilities.forEach(
          a -> {
            if (a.getStartTime().isBefore(arrival)) {
              a.setStartTime(arrival);
            }
            if (a.getEndTime().isAfter(departure)) {
              a.setEndTime(departure);
            }
          });
    }

    return availabilityMapper.toDtoList(availabilities);
  }

  // Dodanie nowej dostępności
  public AvailabilityDto addAvailability(Long entityId, String entityType, AvailabilityDto dto) {
    validateAvailabilityConflict(entityId, entityType, dto, null);

    Availability newAvailability =
        Availability.builder()
            .entityId(entityId)
            .entityType(entityType)
            .dayOfWeek(dto.getDayOfWeek())
            .startTime(LocalTime.parse(dto.getStartTime()))
            .endTime(LocalTime.parse(dto.getEndTime()))
            .build();

    availabilityRepository.save(newAvailability);
    return availabilityMapper.toDto(newAvailability);
  }

  // Aktualizacja dostępności
  public AvailabilityDto updateAvailability(
      Long entityId, String entityType, Long availabilityId, AvailabilityDto dto) {
    Availability existing =
        availabilityRepository
            .findById(availabilityId)
            .orElseThrow(() -> new AvailabilityNotFoundException(availabilityId));

    validateAvailabilityConflict(entityId, entityType, dto, existing);

    existing.setDayOfWeek(dto.getDayOfWeek());
    existing.setStartTime(LocalTime.parse(dto.getStartTime()));
    existing.setEndTime(LocalTime.parse(dto.getEndTime()));

    availabilityRepository.save(existing);
    return availabilityMapper.toDto(existing);
  }

  // Usunięcie dostępności
  public void deleteAvailability(Long entityId, String entityType, Long availabilityId) {
    Availability existing =
        availabilityRepository
            .findById(availabilityId)
            .orElseThrow(() -> new AvailabilityNotFoundException(availabilityId));

    availabilityRepository.delete(existing);
  }

  // Walidacja konfliktu godzin
  private void validateAvailabilityConflict(
      Long entityId, String entityType, AvailabilityDto dto, Availability exclude) {
    Optional<Availability> conflict =
        availabilityRepository.findByEntityIdAndEntityType(entityId, entityType).stream()
            .filter(a -> !a.equals(exclude))
            .filter(a -> a.getDayOfWeek() == dto.getDayOfWeek())
            .filter(
                a ->
                    a.getStartTime().isBefore(LocalTime.parse(dto.getEndTime()))
                        && a.getEndTime().isAfter(LocalTime.parse(dto.getStartTime())))
            .findAny();

    if (conflict.isPresent()) {
      throw new EntityNotAvailableException(entityId, entityType);
    }
  }
}
