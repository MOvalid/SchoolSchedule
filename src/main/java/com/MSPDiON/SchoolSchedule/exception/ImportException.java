package com.MSPDiON.SchoolSchedule.exception;

import java.util.List;
import lombok.Getter;

@Getter
public class ImportException extends RuntimeException {

  private final List<String> errors;

  public ImportException(List<String> errors) {
    super("Błędy importu:\n" + String.join("\n", errors));
    this.errors = errors;
  }
}
