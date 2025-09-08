package com.MSPDiON.SchoolSchedule.exception;

import java.util.Map;
import lombok.Getter;

@Getter
public class ConflictException extends RuntimeException {
  private final Map<String, String> fieldErrors;

  public ConflictException(Map<String, String> fieldErrors) {
    super("Validation failed");
    this.fieldErrors = fieldErrors;
  }
}
