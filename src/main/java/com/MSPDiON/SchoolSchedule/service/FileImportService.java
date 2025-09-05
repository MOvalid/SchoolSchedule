package com.MSPDiON.SchoolSchedule.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileImportService {

  private final StudentImportService studentImportService;
  private final TherapistImportService therapistImportService;
  private final StudentClassImportService studentClassImportService;

  @Transactional
  public void importData(MultipartFile file, String entityType) {
    switch (entityType.toLowerCase()) {
      case "student" -> studentImportService.importFromCsv(file);
      case "therapist" -> therapistImportService.importFromCsv(file);
      case "class" -> studentClassImportService.importFromCsv(file);
      default -> throw new IllegalArgumentException("Nieznany typ: " + entityType);
    }
  }
}
