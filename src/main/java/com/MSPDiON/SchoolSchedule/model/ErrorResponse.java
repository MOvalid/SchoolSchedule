package com.MSPDiON.SchoolSchedule.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
  private int code;
  private String message;
  private LocalDateTime timestamp;
  private String path;
  private String errorType;
}
