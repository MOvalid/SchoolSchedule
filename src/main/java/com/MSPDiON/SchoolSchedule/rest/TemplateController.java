package com.MSPDiON.SchoolSchedule.rest;

import com.MSPDiON.SchoolSchedule.dto.TemplateFileDto;
import com.MSPDiON.SchoolSchedule.service.TemplateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

  private final TemplateService templateService;

  public TemplateController(TemplateService templateService) {
    this.templateService = templateService;
  }

  /**
   * Pobiera szablon importu dla wybranego typu encji.
   *
   * @param entityType student | therapist | class
   * @param format csv | xlsx
   */
  @GetMapping("/{entityType}")
  public ResponseEntity<byte[]> downloadTemplate(
      @PathVariable String entityType, @RequestParam(defaultValue = "csv") String format)
      throws Exception {

    TemplateFileDto file = templateService.generateTemplate(entityType, format);

    MediaType mediaType =
        format.equalsIgnoreCase("xlsx")
            ? MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            : MediaType.TEXT_PLAIN; // CSV

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.fileName() + "\"")
        .header("Access-Control-Expose-Headers", "Content-Disposition")
        .contentType(mediaType)
        .body(file.content());
  }
}
