package com.MSPDiON.SchoolSchedule.exception;

import com.MSPDiON.SchoolSchedule.model.Therapist;

public class TherapistNotAvailableException extends RuntimeException {
  public TherapistNotAvailableException(Therapist therapist) {
    super(
        "Terapeuta "
            + therapist.getFirstName()
            + " "
            + therapist.getLastName()
            + " jest w tym terminie niedostępny.");
  }
}
