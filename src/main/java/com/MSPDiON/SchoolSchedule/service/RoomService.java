package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.RoomDto;
import com.MSPDiON.SchoolSchedule.dto.mapper.RoomMapper;
import com.MSPDiON.SchoolSchedule.model.Room;
import com.MSPDiON.SchoolSchedule.repository.RoomRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomService {

  private final RoomRepository roomRepository;
  private final RoomMapper roomMapper;

  public List<RoomDto> getAll() {
    return roomRepository.findAll().stream().map(roomMapper::toDto).toList();
  }

  public RoomDto getById(Long id) {
    Room room =
        roomRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    return roomMapper.toDto(room);
  }

  public RoomDto create(RoomDto dto) {
    Room entity = roomMapper.toEntity(dto);
    Room saved = roomRepository.save(entity);
    return roomMapper.toDto(saved);
  }

  public RoomDto update(Long id, RoomDto dto) {
    Room existing =
        roomRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

    existing.setName(dto.getName());

    Room saved = roomRepository.save(existing);
    return roomMapper.toDto(saved);
  }

  public void delete(Long id) {
    if (!roomRepository.existsById(id)) {
      throw new RuntimeException("Room not found with id: " + id);
    }
    roomRepository.deleteById(id);
  }
}
