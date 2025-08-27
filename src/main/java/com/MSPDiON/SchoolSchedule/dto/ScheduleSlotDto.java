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
}