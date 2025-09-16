package com.MSPDiON.SchoolSchedule.utils.xlsx;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ExcelFileNameGenerator {

  /**
   * Tworzy czytelną nazwę pliku Excelowego
   *
   * @param baseName np. "PlanLekcji"
   * @param name imię i nazwisko terapeuty lub ucznia
   * @param startDate początek planu
   * @param endDate koniec planu
   * @return nazwa pliku z rozszerzeniem .xlsx
   */
  public static String generateFileName(
      String baseName, String name, LocalDate startDate, LocalDate endDate) {
    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");

    String safeName = sanitizeFileName(name);

    return String.format(
        "%s_%s_%s-%s.xlsx",
        baseName, safeName, startDate.format(dateFormatter), endDate.format(dateFormatter));
  }

  /** Zamienia niedozwolone znaki w nazwie na "_" */
  private static String sanitizeFileName(String input) {
    return input.replaceAll("[\\\\/:*?\"<>|]", "_");
  }
}
