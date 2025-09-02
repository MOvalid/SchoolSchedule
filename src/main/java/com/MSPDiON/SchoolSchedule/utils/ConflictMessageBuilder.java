package com.MSPDiON.SchoolSchedule.utils;

import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import java.util.List;
import java.util.stream.Collectors;

public class ConflictMessageBuilder {

  private static String formatConflicts(List<ScheduleSlot> conflicts) {
    return conflicts.stream().map(FormattingUtils::formatSlot).collect(Collectors.joining("; "));
  }

  public static String buildTherapistConflictMessage(
      ScheduleSlot slot, List<ScheduleSlot> conflicts) {
    return String.format(
        "Terapeuta '%s %s' ma konflikt w grafiku z: %s",
        slot.getTherapist().getFirstName(),
        slot.getTherapist().getLastName(),
        formatConflicts(conflicts));
  }

  public static String buildRoomConflictMessage(ScheduleSlot slot, List<ScheduleSlot> conflicts) {
    return String.format(
        "Sala '%s' jest zajęta w tym czasie. Konflikty: %s",
        slot.getRoom().getName(), formatConflicts(conflicts));
  }

  public static String buildStudentConflictMessage(Student student, List<ScheduleSlot> conflicts) {
    return String.format(
        "Uczeń '%s %s' ma konflikt w grafiku z: %s",
        student.getFirstName(), student.getLastName(), formatConflicts(conflicts));
  }

  public static String buildStudentClassConflictMessage(
      Student student, StudentClass studentClass) {
    return String.format(
        "Uczeń %s %s z klasy %s ma konflikt w grafiku.",
        student.getFirstName(), student.getLastName(), studentClass.getName());
  }

  public static String buildPresenceConflictMessage(Student student) {
    return String.format(
        "Godziny zajęć kolidują z codzienną obecnością ucznia %s %s (%s - %s)",
        student.getFirstName(),
        student.getLastName(),
        student.getArrivalTime(),
        student.getDepartureTime());
  }
}
