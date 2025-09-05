package com.MSPDiON.SchoolSchedule.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public class CsvHelper {
  public static List<String[]> readCsv(MultipartFile file) {
    List<String[]> rows = new ArrayList<>();
    try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
      String line;
      boolean header = true;
      while ((line = br.readLine()) != null) {
        if (header) {
          header = false;
          continue;
        }
        rows.add(line.split(","));
      }
    } catch (Exception e) {
      throw new RuntimeException("Błąd odczytu pliku CSV", e);
    }
    return rows;
  }
}
