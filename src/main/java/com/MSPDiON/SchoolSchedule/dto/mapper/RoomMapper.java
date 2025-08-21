package com.MSPDiON.SchoolSchedule.dto.mapper;

import com.MSPDiON.SchoolSchedule.dto.RoomDto;
import com.MSPDiON.SchoolSchedule.model.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomDto toDto(Room entity) {
        if (entity == null) return null;
        return RoomDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    public Room toEntity(RoomDto dto) {
        if (dto == null) return null;
        return Room.builder()
                .id(dto.getId())
                .name(dto.getName())
                .build();
    }
}

