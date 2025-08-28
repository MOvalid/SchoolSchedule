package com.MSPDiON.SchoolSchedule.dto;

import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.TherapistRole;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TherapistDto {
  private Long id;
  private String firstName;
  private String lastName;
  private TherapistRole role;
  private List<Department> departments;
}
