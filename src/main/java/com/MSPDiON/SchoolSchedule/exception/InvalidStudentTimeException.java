package com.MSPDiON.SchoolSchedule.exception;

public class InvalidStudentTimeException extends RuntimeException {
  public InvalidStudentTimeException() {
    super("Godzina przyjścia nie może być późniejsza niż godzina wyjścia");
  }
}
