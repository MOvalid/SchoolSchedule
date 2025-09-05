package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.utils.CsvHelper;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
public abstract class AbstractImportService<T> {

  public void importFromCsv(MultipartFile file) {
    List<String> errors = new ArrayList<>();
    List<T> toSave = new ArrayList<>();

    List<String[]> rows = CsvHelper.readCsv(file);
    int rowNum = 1;
    for (String[] cols : rows) {
      rowNum++;
      try {
        T entity = parseRow(cols, rowNum, errors);
        if (entity != null) {
          toSave.add(entity);
        }
      } catch (Exception e) {
        errors.add("[Wiersz " + rowNum + "] " + e.getMessage());
      }
    }

    if (!errors.isEmpty()) {
      throw new IllegalArgumentException("Błędy importu:\n" + String.join("\n", errors));
    }

    saveAll(toSave);
  }

  protected abstract T parseRow(String[] cols, int rowNum, List<String> errors) throws Exception;

  protected abstract void saveAll(List<T> entities);
}
