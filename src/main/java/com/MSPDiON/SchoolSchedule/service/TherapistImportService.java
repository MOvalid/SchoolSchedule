package com.MSPDiON.SchoolSchedule.service;

import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.model.TherapistRole;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TherapistImportService extends AbstractImportService<Therapist> {

  private final TherapistRepository therapistRepository;

  @Override
  protected Therapist parseRow(String[] cols, int rowNum, List<String> errors) {
    if (cols.length < 3) {
      errors.add("[Wiersz " + rowNum + "] Za mało kolumn (firstName,lastName,role,departments)");
      return null;
    }

    String firstName = cols[0].trim();
    String lastName = cols[1].trim();
    String roleName = cols[2].trim();
    String departmentsRaw = cols.length > 3 ? cols[3].trim() : "";

    TherapistRole role = null;
    try {
      role = TherapistRole.valueOf(roleName.toUpperCase());
    } catch (Exception e) {
      errors.add("[Wiersz " + rowNum + "] Niepoprawna rola: " + roleName);
    }

    List<Department> departments = new ArrayList<>();
    for (String dep : departmentsRaw.split(";")) {
      if (dep.isBlank()) continue;
      try {
        departments.add(Department.valueOf(dep.trim().toUpperCase()));
      } catch (Exception e) {
        errors.add("[Wiersz " + rowNum + "] Niepoprawny oddział: " + dep);
      }
    }

    if (!errors.isEmpty()) return null;

    Therapist t = new Therapist();
    t.setFirstName(firstName);
    t.setLastName(lastName);
    t.setRole(role);
    t.setDepartments(departments);
    return t;
  }

  @Override
  protected void saveAll(List<Therapist> entities) {
    therapistRepository.saveAll(entities);
  }
}
