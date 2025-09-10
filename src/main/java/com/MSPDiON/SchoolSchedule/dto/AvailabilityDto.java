package com.MSPDiON.SchoolSchedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityDto {
  private Long id;
  private int dayOfWeek;
  private String startTime;
  private String endTime;
  private String entityType;
  private Long entityId;
}
