package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.StudentClassDto;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import org.springframework.stereotype.Component;

@Component
public class StudentClassMapper {

    public StudentClassDto toDto(StudentClass entity) {
        if (entity == null) return null;
        return StudentClassDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .department(entity.getDepartment())
                .build();
    }

    public StudentClass toEntity(StudentClassDto dto) {
        if (dto == null) return null;
        return StudentClass.builder()
                .id(dto.getId())
                .name(dto.getName())
                .department(dto.getDepartment())
                .build();
    }
}

