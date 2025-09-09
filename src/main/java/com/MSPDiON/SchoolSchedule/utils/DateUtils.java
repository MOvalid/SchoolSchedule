package com.MSPDiON.SchoolSchedule.utils;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

  public static String getPolishDayName(DayOfWeek day) {
    return switch (day) {
      case MONDAY -> "Poniedziałek";
      case TUESDAY -> "Wtorek";
      case WEDNESDAY -> "Środa";
      case THURSDAY -> "Czwartek";
      case FRIDAY -> "Piątek";
      case SATURDAY -> "Sobota";
      case SUNDAY -> "Niedziela";
    };
  }

  public static LocalTime parseToLocalTime(String isoDateTime) {
    return OffsetDateTime.parse(isoDateTime, DateTimeFormatter.ISO_DATE_TIME).toLocalTime();
  }

  public static LocalDate parseToLocalDate(String isoDate) {
    return LocalDate.parse(isoDate);
  }

  public static boolean isTimeOverlap(
      LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
    if (start1 == null || end1 == null || start2 == null || end2 == null) {
      return false;
    }
    return start1.isBefore(end2) && end1.isAfter(start2);
  }
}
