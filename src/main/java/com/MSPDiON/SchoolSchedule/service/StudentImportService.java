package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.exception.ImportException;
import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentImportService extends AbstractImportService<Student> {

  private final StudentRepository studentRepository;
  private final StudentClassRepository classRepository;

  @Override
  protected Student parseRow(String[] cols, int rowNum, List<String> errors)
      throws ImportException {
    List<String> rowErrors = new ArrayList<>();

    if (cols.length < 6) {
      rowErrors.add(
          "[Wiersz "
              + rowNum
              + "] Za mało kolumn (firstName,lastName,className,department,arrivalTime,departureTime)");
      throw new ImportException(rowErrors);
    }

    String firstName = cols[0].trim();
    String lastName = cols[1].trim();
    String className = cols[2].trim();
    String departmentName = cols[3].trim();
    String arrivalStr = cols[4].trim();
    String departureStr = cols[5].trim();

    validateBasicFields(firstName, lastName, rowNum, rowErrors);
    Department department = validateDepartment(departmentName, rowNum, rowErrors);
    StudentClass studentClass = validateClass(className, department, rowNum, rowErrors);
    LocalTime[] times = parseTimes(arrivalStr, departureStr, rowNum, rowErrors);

    if (!rowErrors.isEmpty()) {
      throw new ImportException(rowErrors);
    }

    return Student.builder()
        .firstName(firstName)
        .lastName(lastName)
        .studentClass(studentClass)
        .arrivalTime(times[0])
        .departureTime(times[1])
        .build();
  }

  @Override
  protected void saveAll(List<Student> entities) {
    studentRepository.saveAll(entities);
  }

  private void validateBasicFields(
      String firstName, String lastName, int rowNum, List<String> errors) {
    if (firstName.isEmpty()) errors.add("[Wiersz " + rowNum + "] Brak imienia");
    if (lastName.isEmpty()) errors.add("[Wiersz " + rowNum + "] Brak nazwiska");
  }

  private Department validateDepartment(String departmentName, int rowNum, List<String> errors) {
    try {
      return Department.valueOf(departmentName.toUpperCase());
    } catch (Exception e) {
      errors.add("[Wiersz " + rowNum + "] Niepoprawny oddział: " + departmentName);
      return null;
    }
  }

  private StudentClass validateClass(
      String className, Department department, int rowNum, List<String> errors) {
    StudentClass studentClass = classRepository.findFirstByNameIgnoreCase(className).orElse(null);
    if (studentClass == null) {
      errors.add("[Wiersz " + rowNum + "] Nie znaleziono klasy: " + className);
    } else if (!studentClass.getDepartment().equals(department)) {
      errors.add(
          "[Wiersz " + rowNum + "] Klasa " + className + " nie należy do oddziału " + department);
    }
    return studentClass;
  }

  private LocalTime[] parseTimes(
      String arrivalStr, String departureStr, int rowNum, List<String> errors) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
    LocalTime arrival = null;
    LocalTime departure = null;

    try {
      if (!arrivalStr.isEmpty()) arrival = LocalTime.parse(arrivalStr, formatter);
      if (!departureStr.isEmpty()) departure = LocalTime.parse(departureStr, formatter);

      if (arrival != null && departure != null && departure.isBefore(arrival)) {
        errors.add("[Wiersz " + rowNum + "] Godzina wyjścia nie może być przed godziną przyjścia");
      }
    } catch (Exception e) {
      errors.add("[Wiersz " + rowNum + "] Niepoprawny format godziny (HH:mm)");
    }

    return new LocalTime[] {arrival, departure};
  }
}
