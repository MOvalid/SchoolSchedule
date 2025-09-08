package com.MSPDiON.SchoolSchedule.exception;

public class TherapistNotFoundException extends RuntimeException {
  public TherapistNotFoundException(Long id) {
    super("Nie znaleziono terapeuty z id: " + id);
  }
}
