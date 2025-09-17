package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.dto.TemplateFileDto;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class TemplateService {

  public TemplateFileDto generateTemplate(String entityType, String format) throws Exception {
    return switch (entityType.toLowerCase()) {
      case "student" -> format.equalsIgnoreCase("xlsx")
          ? generateStudentXlsx()
          : loadCsvFromResources("templates/students.csv", "students.csv");
      case "therapist" -> format.equalsIgnoreCase("xlsx")
          ? generateTherapistXlsx()
          : loadCsvFromResources("templates/therapists.csv", "therapists.csv");
      case "class" -> format.equalsIgnoreCase("xlsx")
          ? generateClassXlsx()
          : loadCsvFromResources("templates/classes.csv", "classes.csv");
      default -> throw new IllegalArgumentException("Nieznany typ encji: " + entityType);
    };
  }

  // ---------- CSV ----------
  private TemplateFileDto loadCsvFromResources(String path, String fileName) throws IOException {
    ClassPathResource resource = new ClassPathResource(path);
    try (var in = resource.getInputStream();
        var out = new ByteArrayOutputStream()) {
      out.write(new byte[] {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
      in.transferTo(out);
      return new TemplateFileDto(fileName, out.toByteArray());
    }
  }

  // ---------- STUDENTS XLSX ----------
  private TemplateFileDto generateStudentXlsx() throws Exception {
    String[] headers = {
      "firstName", "lastName", "className", "department", "arrivalTime", "departureTime"
    };
    String[][] rows = {
      {"Kuba", "Wiśniewski", "1A", "ZRW", "07:00", "15:00"},
      {"Julia", "Kowal", "2B", "ZRW", "07:00", "16:00"}
    };
    return generateXlsx("students.xlsx", headers, rows);
  }

  // ---------- THERAPISTS XLSX ----------
  private TemplateFileDto generateTherapistXlsx() throws Exception {
    String[] headers = {"firstName", "lastName", "role", "departments"};
    String[][] rows = {
      {"Tomasz", "Zielinski", "PSYCHOLOGIST", "PDP"},
      {"Katarzyna", "Kaczmarek", "PEDAGOGUE", "DEPT_1"}
    };
    return generateXlsx("therapists.xlsx", headers, rows);
  }

  // ---------- CLASSES XLSX ----------
  private TemplateFileDto generateClassXlsx() throws Exception {
    String[] headers = {"name", "department"};
    String[][] rows = {
      {"5E", "DEPT_1"},
      {"6F", "DEPT_2"}
    };
    return generateXlsx("classes.xlsx", headers, rows);
  }

  // ---------- helper do XLSX ----------
  private TemplateFileDto generateXlsx(String fileName, String[] headers, String[][] rows)
      throws Exception {
    try (var workbook = new XSSFWorkbook();
        var out = new ByteArrayOutputStream()) {
      Sheet sheet = workbook.createSheet("Template");
      Row headerRow = sheet.createRow(0);

      for (int i = 0; i < headers.length; i++) {
        headerRow.createCell(i).setCellValue(headers[i]);
      }

      for (int r = 0; r < rows.length; r++) {
        Row row = sheet.createRow(r + 1);
        for (int c = 0; c < rows[r].length; c++) {
          row.createCell(c).setCellValue(rows[r][c]);
        }
      }

      workbook.write(out);
      return new TemplateFileDto(fileName, out.toByteArray());
    }
  }
}
