package com.MSPDiON.SchoolSchedule.exception;

public class StudentNotFoundException extends RuntimeException {
  public StudentNotFoundException(Long id) {
    super("Nie znaleziono ucznia z id: " + id);
  }
}
