package com.MSPDiON.SchoolSchedule.dto;

import com.MSPDiON.SchoolSchedule.model.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentClassDto {
    private Long id;
    private String name;
    private Department department;
}
