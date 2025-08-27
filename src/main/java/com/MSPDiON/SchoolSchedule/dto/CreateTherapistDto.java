package com.MSPDiON.SchoolSchedule.dto;

import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.TherapistRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTherapistDto {
    private String firstName;
    private String lastName;
    private TherapistRole role;
    private List<Department> departments;
}