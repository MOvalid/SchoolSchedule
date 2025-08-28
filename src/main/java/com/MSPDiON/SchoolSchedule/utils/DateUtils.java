package com.MSPDiON.SchoolSchedule.utils;

import java.time.DayOfWeek;

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
}
