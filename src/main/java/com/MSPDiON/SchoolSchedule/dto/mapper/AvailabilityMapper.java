package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.AvailabilityDto;
import com.MSPDiON.SchoolSchedule.model.Availability;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AvailabilityMapper {

  private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

  public List<AvailabilityDto> toDtoList(List<Availability> availabilities) {
    if (availabilities == null) return Collections.emptyList();
    return availabilities.stream().map(this::toDto).toList();
  }

  public AvailabilityDto toDto(Availability availability) {
    if (availability == null) return null;

    String start = availability.getStartTime().format(TIME_FORMATTER);
    String end = availability.getEndTime().format(TIME_FORMATTER);

    return AvailabilityDto.builder()
        .id(availability.getId())
        .entityId(availability.getEntityId())
        .entityType(availability.getEntityType())
        .dayOfWeek(availability.getDayOfWeek())
        .startTime(start)
        .endTime(end)
        .build();
  }
}
