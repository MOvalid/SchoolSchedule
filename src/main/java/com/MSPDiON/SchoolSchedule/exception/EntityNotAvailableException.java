package com.MSPDiON.SchoolSchedule.exception;

public class EntityNotAvailableException extends RuntimeException {
  public EntityNotAvailableException(Long entityId, String entityType) {
    super("Encja + " + entityType + " o id " + entityId + "jest niedostępna.");
  }
}
