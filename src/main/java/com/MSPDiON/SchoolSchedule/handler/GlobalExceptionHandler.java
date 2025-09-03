package com.MSPDiON.SchoolSchedule.handler;

import com.MSPDiON.SchoolSchedule.exception.ConflictException;
import com.MSPDiON.SchoolSchedule.exception.InvalidStudentTimeException;
import com.MSPDiON.SchoolSchedule.exception.RoomNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentClassNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.TherapistNotFoundException;
import com.MSPDiON.SchoolSchedule.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(StudentNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleStudentNotFound(
      StudentNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(400, ex.getMessage(), LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(TherapistNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTherapistNotFound(
      TherapistNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(400, ex.getMessage(), LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(StudentClassNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTherapistNotFound(
      StudentClassNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(400, ex.getMessage(), LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(RoomNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleRoomNotFound(
      RoomNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(400, ex.getMessage(), LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ErrorResponse> handleConflict(
      ConflictException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(409, ex.getMessage(), LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponse> handleResponseStatusException(
      ResponseStatusException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            ex.getStatusCode().value(),
            ex.getReason() != null ? ex.getReason() : ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI());
    return new ResponseEntity<>(error, ex.getStatusCode());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      ResponseStatusException ex, HttpServletRequest request) {
    String message = ex.getReason() != null ? ex.getReason() : ex.getMessage();
    message = "IllegalArgumentException: " + message;
    ErrorResponse error =
        new ErrorResponse(400, message, LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(InvalidStudentTimeException.class)
  public ResponseEntity<ErrorResponse> handleInvalidStudentTimeException(
      ResponseStatusException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(400, ex.getMessage(), LocalDateTime.now(), request.getRequestURI());
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }
}
