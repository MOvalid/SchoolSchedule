package com.MSPDiON.SchoolSchedule.exception;

public class TherapistNotFoundException extends RuntimeException {
  public TherapistNotFoundException(Long id) {
    super("Therapist not found with id: " + id);
  }
}
