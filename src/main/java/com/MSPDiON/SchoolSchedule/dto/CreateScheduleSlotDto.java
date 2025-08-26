package com.MSPDiON.SchoolSchedule.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateScheduleSlotDto {
    private Long therapistId;
    private Long studentId;
    private List<Long> studentIds;
    private Long roomId;
    private Long studentClassId;
    private int dayOfWeek;
    private String startTime;    // HH:mm
    private String endTime;      // HH:mm
}
