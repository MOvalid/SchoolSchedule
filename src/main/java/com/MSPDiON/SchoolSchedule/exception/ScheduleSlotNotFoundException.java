package com.MSPDiON.SchoolSchedule.exception;

public class ScheduleSlotNotFoundException extends RuntimeException {
  public ScheduleSlotNotFoundException(Long id) {
    super("Nie znaleziono slotu z id: " + id);
  }
}
