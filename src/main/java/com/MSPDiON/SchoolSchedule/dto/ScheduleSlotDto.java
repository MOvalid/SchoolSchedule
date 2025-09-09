package com.MSPDiON.SchoolSchedule.dto;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleSlotDto {
  private Long id;
  private String title;

  private Long therapistId;
  private Long roomId;

  private boolean individual;

  private Long studentId;
  private Set<Long> studentIds;
  private Long studentClassId;

  private String startTime;
  private String endTime;
  private int dayOfWeek;

  private String validFrom;
  private String validTo;
}
