package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.RoomDto;
import com.MSPDiON.SchoolSchedule.service.RoomService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

  private final RoomService roomService;

  @GetMapping
  public List<RoomDto> getAll() {
    return roomService.getAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<RoomDto> getById(@PathVariable Long id) {
    return ResponseEntity.ok(roomService.getById(id));
  }

  @PostMapping
  public ResponseEntity<RoomDto> create(@RequestBody RoomDto dto) {
    return ResponseEntity.ok(roomService.create(dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<RoomDto> update(@PathVariable Long id, @RequestBody RoomDto dto) {
    return ResponseEntity.ok(roomService.update(id, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    roomService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
