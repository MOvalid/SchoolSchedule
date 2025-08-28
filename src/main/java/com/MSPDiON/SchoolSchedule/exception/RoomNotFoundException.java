package com.MSPDiON.SchoolSchedule.exception;

public class RoomNotFoundException extends RuntimeException {
  public RoomNotFoundException(Long id) {
    super("Room not found with id: " + id);
  }
}
