package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.model.Availability;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TherapistMapper {

  private final AvailabilityMapper availabilityMapper;

  public TherapistMapper(AvailabilityMapper availabilityMapper) {
    this.availabilityMapper = availabilityMapper;
  }

  public TherapistDto toDto(Therapist entity, List<Availability> availabilities) {
    if (entity == null) return null;

    return TherapistDto.builder()
        .id(entity.getId())
        .firstName(entity.getFirstName())
        .lastName(entity.getLastName())
        .role(entity.getRole())
        .departments(entity.getDepartments())
        .availabilities(availabilityMapper.toDtoList(availabilities.stream().toList()))
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
}
