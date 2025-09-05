package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentClassImportService extends AbstractImportService<StudentClass> {

  private final StudentClassRepository classRepository;

  @Override
  protected StudentClass parseRow(String[] cols, int rowNum, List<String> errors) {
    if (cols.length < 2) {
      errors.add("[Wiersz " + rowNum + "] Za mało kolumn (name,department)");
      return null;
    }

    String name = cols[0].trim();
    String departmentName = cols[1].trim();

    if (name.isEmpty()) errors.add("[Wiersz " + rowNum + "] Brak nazwy klasy");

    Department department = null;
    try {
      department = Department.valueOf(departmentName.toUpperCase());
    } catch (Exception e) {
      errors.add("[Wiersz " + rowNum + "] Niepoprawny oddział: " + departmentName);
    }

    if (!errors.isEmpty()) return null;

    StudentClass sc = new StudentClass();
    sc.setName(name);
    sc.setDepartment(department);
    return sc;
  }

  @Override
  protected void saveAll(List<StudentClass> entities) {
    classRepository.saveAll(entities);
  }
}
