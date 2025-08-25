package com.MSPDiON.SchoolSchedule.dto;

import lombok.Data;

@Data
public class CreateScheduleSlotDto {
    private Long therapistId;
    private Long studentId;
    private Long roomId;
    private Long studentClassId;
    private int dayOfWeek;
    private String startTime;    // HH:mm
    private String endTime;      // HH:mm
}
