package com.MSPDiON.SchoolSchedule.utils;

import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;

import java.util.List;
import java.util.stream.Collectors;

public class ConflictMessageBuilder {

    public static String buildTherapistConflictMessage(ScheduleSlot slot, List<ScheduleSlot> conflicts) {
        String conflictInfo = conflicts.stream()
                .map(FormattingUtils::formatSlot)
                .collect(Collectors.joining("; "));
        return String.format("Terapeuta '%s %s' ma konflikt w grafiku z: %s",
                slot.getTherapist().getFirstName(),
                slot.getTherapist().getLastName(),
                conflictInfo);
    }

    public static String buildRoomConflictMessage(ScheduleSlot slot, List<ScheduleSlot> conflicts) {
        String conflictInfo = conflicts.stream()
                .map(FormattingUtils::formatSlot)
                .collect(Collectors.joining("; "));
        return String.format("Sala '%s' jest zajęta w tym czasie. Konflikty: %s",
                slot.getRoom().getName(),
                conflictInfo);
    }

    public static String buildStudentConflictMessage(Student student, List<ScheduleSlot> conflicts) {
        String conflictInfo = conflicts.stream()
                .map(FormattingUtils::formatSlot)
                .collect(Collectors.joining("; "));
        return String.format("Uczeń '%s %s' ma konflikt w grafiku z: %s",
                student.getFirstName(),
                student.getLastName(),
                conflictInfo);
    }
}
