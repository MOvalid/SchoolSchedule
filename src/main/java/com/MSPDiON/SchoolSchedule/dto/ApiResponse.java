package com.MSPDiON.SchoolSchedule.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
  private boolean success;
  private String message;
  private T data;
  private List<String> errors;
}
