package com.MSPDiON.SchoolSchedule.exception;

public class StudentClassNotFoundException extends RuntimeException {
  public StudentClassNotFoundException(Long id) {
    super("Nie znaleziono klasy z id: " + id);
  }
}
