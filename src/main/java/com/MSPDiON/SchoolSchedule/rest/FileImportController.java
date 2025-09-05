package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.ApiResponse;
import com.MSPDiON.SchoolSchedule.service.FileImportService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class FileImportController {

  private final FileImportService fileImportService;

  @PostMapping("/upload")
  public ResponseEntity<ApiResponse<Void>> importData(
      @RequestParam("files") List<MultipartFile> files,
      @RequestParam("entityType") String entityType) {
    try {
      for (MultipartFile file : files) {
        fileImportService.importData(file, entityType);
      }

      ApiResponse<Void> response =
          new ApiResponse<>(true, "Import zakończony sukcesem", null, null);
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      ApiResponse<Void> response =
          new ApiResponse<>(false, "Błąd podczas importu", null, List.of(e.getMessage()));
      return ResponseEntity.badRequest().body(response);
    }
  }
}
