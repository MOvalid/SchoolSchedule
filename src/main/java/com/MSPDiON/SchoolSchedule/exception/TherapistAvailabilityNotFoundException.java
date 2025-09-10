package com.MSPDiON.SchoolSchedule.exception;

public class TherapistAvailabilityNotFoundException extends RuntimeException {
  public TherapistAvailabilityNotFoundException(Long id) {
    super("Nie znaleziono dostępności terapeuty z id: " + id);
  }
}
