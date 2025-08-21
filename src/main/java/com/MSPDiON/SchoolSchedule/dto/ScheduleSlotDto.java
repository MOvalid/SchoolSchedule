package com.MSPDiON.SchoolSchedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleSlotDto {
    private Long id;

    private Long therapistId;
    private Long roomId;

    private boolean individual;
    private Long studentClassId;
    private Set<Long> studentIds;

    private LocalTime startTime;
    private LocalTime endTime;
}
