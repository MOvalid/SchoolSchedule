package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.CreateTherapistDto;
import com.MSPDiON.SchoolSchedule.dto.TherapistDto;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import org.springframework.stereotype.Component;

@Component
public class TherapistMapper {

  public TherapistDto toDto(Therapist entity) {
    if (entity == null) return null;
    return TherapistDto.builder()
        .id(entity.getId())
        .firstName(entity.getFirstName())
        .lastName(entity.getLastName())
        .role(entity.getRole())
        .departments(entity.getDepartments())
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
}
