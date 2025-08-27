package com.MSPDiON.SchoolSchedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStudentDto {
    private String firstName;
    private String lastName;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Long studentClassId;
}