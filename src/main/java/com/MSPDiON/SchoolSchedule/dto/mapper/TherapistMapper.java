package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistAvailabilityDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.model.TherapistAvailability;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TherapistMapper {

  private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

  public TherapistDto toDto(Therapist entity) {
    if (entity == null) return null;
    return TherapistDto.builder()
        .id(entity.getId())
        .firstName(entity.getFirstName())
        .lastName(entity.getLastName())
        .role(entity.getRole())
        .departments(entity.getDepartments())
        .availabilities(
            entity.getAvailabilities().stream().map(TherapistMapper::toAvailabilityDto).toList())
        .build();
  }

  public Therapist toEntity(TherapistDto dto) {
    if (dto == null) return null;
    return Therapist.builder()
        .id(dto.getId())
        .firstName(dto.getFirstName())
        .lastName(dto.getLastName())
        .role(dto.getRole())
        .departments(dto.getDepartments())
        .build();
  }

  public Therapist toEntity(CreateTherapistDto dto) {
    if (dto == null) return null;
    return Therapist.builder()
        .firstName(dto.getFirstName())
        .lastName(dto.getLastName())
        .role(dto.getRole())
        .departments(dto.getDepartments())
        .build();
  }

  public List<TherapistAvailabilityDto> mapAvailabilities(
      List<TherapistAvailability> availabilities) {
    if (availabilities == null) return Collections.emptyList();
    return availabilities.stream().map(TherapistMapper::toAvailabilityDto).toList();
  }

  public static TherapistAvailabilityDto toAvailabilityDto(TherapistAvailability availability) {
    if (availability == null) return null;

    String start = availability.getStartTime().format(TIME_FORMATTER);
    String end = availability.getEndTime().format(TIME_FORMATTER);

    return TherapistAvailabilityDto.builder()
        .id(availability.getId())
        .dayOfWeek(availability.getDayOfWeek())
        .startTime(start)
        .endTime(end)
        .build();
  }
}
