package com.MSPDiON.SchoolSchedule.dto;

import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
  private Long id;
  private String firstName;
  private String lastName;
  private LocalTime arrivalTime;
  private LocalTime departureTime;
  private Long studentClassId;
}
