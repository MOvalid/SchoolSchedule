package com.MSPDiON.SchoolSchedule.exception;

public class AvailabilityNotFoundException extends RuntimeException {
  public AvailabilityNotFoundException(Long id) {
    super("Nie znaleziono dostępności terapeuty z id: " + id);
  }
}
