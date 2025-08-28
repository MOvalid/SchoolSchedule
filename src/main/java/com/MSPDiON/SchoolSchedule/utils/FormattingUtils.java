package com.MSPDiON.SchoolSchedule.utils;

import static com.MSPDiON.SchoolSchedule.utils.DateUtils.getPolishDayName;

import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import java.time.format.DateTimeFormatter;

public class FormattingUtils {

  private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

  public static String formatSlot(ScheduleSlot slot) {
    String dayName = getPolishDayName(slot.getDayOfWeek());
    return String.format(
        "[%s %s-%s, Terapeuta: %s %s, Sala: %s]",
        dayName,
        slot.getStartTime().format(TIME_FORMAT),
        slot.getEndTime().format(TIME_FORMAT),
        slot.getTherapist() != null ? slot.getTherapist().getFirstName() : "Brak",
        slot.getTherapist() != null ? slot.getTherapist().getLastName() : "",
        slot.getRoom() != null ? slot.getRoom().getName() : "Brak");
  }
}
