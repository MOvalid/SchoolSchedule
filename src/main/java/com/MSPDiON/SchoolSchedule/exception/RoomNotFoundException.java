package com.MSPDiON.SchoolSchedule.exception;

public class RoomNotFoundException extends RuntimeException {
  public RoomNotFoundException(Long id) {
    super("Nie znaleziono sali z id: " + id);
  }
}
