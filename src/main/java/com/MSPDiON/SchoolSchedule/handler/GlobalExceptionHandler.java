package com.MSPDiON.SchoolSchedule.handler;

import com.MSPDiON.SchoolSchedule.exception.ConflictException;
import com.MSPDiON.SchoolSchedule.exception.ImportException;
import com.MSPDiON.SchoolSchedule.exception.InvalidStudentTimeException;
import com.MSPDiON.SchoolSchedule.exception.RoomNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentClassNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.StudentNotFoundException;
import com.MSPDiON.SchoolSchedule.exception.TherapistNotFoundException;
import com.MSPDiON.SchoolSchedule.model.ErrorResponse;
import com.MSPDiON.SchoolSchedule.utils.ConflictMessageBuilder;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
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
        new ErrorResponse(
            400,
            ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "StudentNotFoundException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(TherapistNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTherapistNotFound(
      TherapistNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            400,
            ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "TherapistNotFoundException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(StudentClassNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTherapistNotFound(
      StudentClassNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            400,
            ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "StudentClassNotFoundException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(RoomNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleRoomNotFound(
      RoomNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            400,
            ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "RoomNotFoundException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {
    Map<String, Object> response = new HashMap<>();

    Map<String, String> fieldErrors = ex.getFieldErrors();
    String message = ConflictMessageBuilder.buildLimitedErrorMessage(fieldErrors);

    response.put("message", message);
    response.put("errors", fieldErrors);
    return ResponseEntity.badRequest().body(response);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponse> handleResponseStatusException(
      ResponseStatusException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            ex.getStatusCode().value(),
            ex.getReason() != null ? ex.getReason() : ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "ResponseStatusException");
    return new ResponseEntity<>(error, ex.getStatusCode());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            400,
            ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "IllegalArgumentException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(InvalidStudentTimeException.class)
  public ResponseEntity<ErrorResponse> handleInvalidStudentTimeException(
      InvalidStudentTimeException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            400,
            ex.getMessage(),
            LocalDateTime.now(),
            request.getRequestURI(),
            "InvalidStudentTimeException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ImportException.class)
  public ResponseEntity<ErrorResponse> handleImportException(
      ImportException ex, HttpServletRequest request) {
    ErrorResponse error =
        new ErrorResponse(
            400, ex.getMessage(), LocalDateTime.now(), request.getRequestURI(), "ImportException");
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }
}
