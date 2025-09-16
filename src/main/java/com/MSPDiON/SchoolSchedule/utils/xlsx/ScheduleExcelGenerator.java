package com.MSPDiON.SchoolSchedule.utils.xlsx;

import com.MSPDiON.SchoolSchedule.dto.ScheduleSlotDto;
import com.MSPDiON.SchoolSchedule.model.Room;
import com.MSPDiON.SchoolSchedule.repository.RoomRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

@Component
public class ScheduleExcelGenerator {

  // Godzina początkowa i końcowa planu lekcji
  private static final LocalTime START_TIME = LocalTime.of(6, 0);
  private static final LocalTime END_TIME = LocalTime.of(17, 0);

  private static final String SHEET_NAME = "Plan Lekcji";

  // Czas trwania jednej komórki w minutach
  private static final int TIME_STEP_MINUTES = 30;

  // Liczba dni w tygodniu do wyświetlenia
  private static final int NUMBER_OF_DAYS = 5;

  // Wysokość wiersza w punktach dla slotów
  private static final float ROW_HEIGHT_POINTS = 40f;

  // Szerokość kolumn w Excelu (w jednostkach POI)
  private static final int TIME_COLUMN_WIDTH = 12 * 256;
  private static final int DAY_COLUMN_WIDTH = 20 * 256;

  // Kolory dla zajęć, cyklicznie używane
  private static final IndexedColors[] COLORS = {
    IndexedColors.LIGHT_YELLOW,
    IndexedColors.LIGHT_GREEN,
    IndexedColors.LIGHT_CORNFLOWER_BLUE,
    IndexedColors.LIGHT_ORANGE,
    IndexedColors.LIGHT_TURQUOISE
  };

  // Liczba uczniów do pokazania w planie terapeuty
  private static final int MAX_STUDENTS_DISPLAY = 3;

  // Nagłówek font
  private static final short HEADER_FONT_SIZE = 12;

  // Format godzin w Excelu
  private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("H:mm");

  // Nazwy dni tygodnia w nagłówku
  private static final String[] WEEK_DAYS = {
    "Godzina", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"
  };

  private static int colorIndex = 0;

  private final RoomRepository roomRepository;
  private final StudentRepository studentRepository;
  private final TherapistRepository therapistRepository;

  public ScheduleExcelGenerator(
      RoomRepository roomRepository,
      StudentRepository studentRepository,
      TherapistRepository therapistRepository) {
    this.roomRepository = roomRepository;
    this.studentRepository = studentRepository;
    this.therapistRepository = therapistRepository;
  }

  /**
   * Generuje Workbook w pamięci na podstawie listy ScheduleSlotDto dla entity
   * (uczeń/terapeuta/klasa)
   */
  public Workbook generateSchedule(
      List<ScheduleSlotDto> slots, String entityName, String entityType) {
    Workbook workbook = new XSSFWorkbook();
    CellStyle headerStyle = createHeaderStyle(workbook);
    CellStyle cellStyle = createCellStyle(workbook);

    Sheet sheet = createSheetWithName(workbook, entityName);

    createNameRow(sheet, entityName, headerStyle);
    createHeaderRow(sheet, headerStyle);
    createTimeRows(sheet, headerStyle, cellStyle);
    adjustSizes(sheet);

    for (ScheduleSlotDto slot : slots) {
      addSlot(sheet, slot, workbook, entityType);
    }

    return workbook;
  }

  private void addSlot(Sheet sheet, ScheduleSlotDto slotDto, Workbook workbook, String entityType) {
    DayOfWeek day = mapIntToDayOfWeek(slotDto.getDayOfWeek());
    if (day == null) return;

    LocalTime start = LocalTime.parse(slotDto.getStartTime(), TIME_FORMATTER);
    LocalTime end = LocalTime.parse(slotDto.getEndTime(), TIME_FORMATTER);
    int[] rows = calculateRowsForTime(start, end);
    int dayColumn = mapDayToColumn(day);
    CellStyle style = createMeetingCellStyle(workbook);

    for (int r = rows[0]; r <= rows[1]; r++) {
      Row row = sheet.getRow(r);
      if (row == null) row = sheet.createRow(r);

      Cell cell = row.getCell(dayColumn);
      if (cell == null) cell = row.createCell(dayColumn);
      cell.setCellStyle(style);

      if (r == rows[0]) {
        String text = buildCellText(slotDto, entityType);
        cell.setCellValue(text);
      }
    }

    sheet.addMergedRegion(new CellRangeAddress(rows[0], rows[1], dayColumn, dayColumn));
  }

  private String buildCellText(ScheduleSlotDto slotDto, String entityType) {
    LocalTime start = LocalTime.parse(slotDto.getStartTime(), TIME_FORMATTER);
    LocalTime end = LocalTime.parse(slotDto.getEndTime(), TIME_FORMATTER);

    StringBuilder text = new StringBuilder();
    text.append(slotDto.getTitle()).append("\n");
    text.append("Godz.: ")
        .append(start.format(TIME_FORMATTER))
        .append("-")
        .append(end.format(TIME_FORMATTER))
        .append("\n");

    text.append("Sala: ").append(fetchRoomName(slotDto)).append("\n");

    if ("student".equalsIgnoreCase(entityType)) {
      text.append("Terapeuta: ").append(fetchTherapistName(slotDto)).append("\n");
    } else if ("therapist".equalsIgnoreCase(entityType)) {
      text.append("Uczniowie: ").append(fetchStudentNames(slotDto)).append("\n");
    } else if ("class".equalsIgnoreCase(entityType)) {
      text.append("Terapeuta: ").append(fetchTherapistName(slotDto)).append("\n");
    }

    return text.toString();
  }

  private String fetchRoomName(ScheduleSlotDto slotDto) {
    if (slotDto.getRoomId() == null) return "Brak sali";
    return roomRepository.findById(slotDto.getRoomId()).map(Room::getName).orElse("Brak sali");
  }

  private String fetchTherapistName(ScheduleSlotDto slotDto) {
    if (slotDto.getTherapistId() == null) return "Brak terapeuty";
    return therapistRepository
        .findById(slotDto.getTherapistId())
        .map(t -> t.getFirstName() + " " + t.getLastName())
        .orElse("Brak terapeuty");
  }

  private String fetchStudentNames(ScheduleSlotDto slotDto) {
    if (slotDto.getStudentIds() == null || slotDto.getStudentIds().isEmpty()) return "Brak uczniów";
    return slotDto.getStudentIds().stream()
        .limit(MAX_STUDENTS_DISPLAY)
        .map(
            id ->
                studentRepository
                    .findById(id)
                    .map(s -> s.getFirstName() + " " + s.getLastName())
                    .orElse("Nieznany"))
        .toList()
        .toString()
        .replaceAll("[\\[\\]]", "");
  }

  private void createNameRow(Sheet sheet, String name, CellStyle style) {
    Row row = sheet.createRow(0);
    Cell cell = row.createCell(0);
    cell.setCellValue(name.replace("_", " "));
    cell.setCellStyle(style);
    sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, NUMBER_OF_DAYS));
  }

  private void createHeaderRow(Sheet sheet, CellStyle style) {
    Row row = sheet.createRow(1);
    for (int i = 0; i < WEEK_DAYS.length; i++) {
      Cell cell = row.createCell(i);
      cell.setCellValue(WEEK_DAYS[i]);
      cell.setCellStyle(style);
    }
  }

  private void createTimeRows(Sheet sheet, CellStyle headerStyle, CellStyle cellStyle) {
    LocalTime time = START_TIME;
    int rowIndex = 2;
    while (!time.isAfter(END_TIME)) {
      Row row = sheet.createRow(rowIndex);
      Cell hourCell = row.createCell(0);
      hourCell.setCellValue(time.format(TIME_FORMATTER));
      hourCell.setCellStyle(headerStyle);

      for (int c = 1; c <= NUMBER_OF_DAYS; c++) {
        Cell cell = row.createCell(c);
        cell.setCellStyle(cellStyle);
      }

      time = time.plusMinutes(TIME_STEP_MINUTES);
      rowIndex++;
    }
  }

  private CellStyle createHeaderStyle(Workbook wb) {
    CellStyle style = wb.createCellStyle();
    Font font = wb.createFont();
    font.setBold(true);
    font.setFontHeightInPoints(HEADER_FONT_SIZE);
    style.setFont(font);
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);
    style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    addBorders(style);
    return style;
  }

  private CellStyle createCellStyle(Workbook wb) {
    CellStyle style = wb.createCellStyle();
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);
    addBorders(style);
    return style;
  }

  private CellStyle createMeetingCellStyle(Workbook wb) {
    CellStyle style = wb.createCellStyle();
    style.setAlignment(HorizontalAlignment.CENTER);
    style.setVerticalAlignment(VerticalAlignment.CENTER);
    style.setFillForegroundColor(COLORS[colorIndex % COLORS.length].getIndex());
    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    style.setWrapText(true);
    addBorders(style);
    colorIndex++;
    return style;
  }

  private void addBorders(CellStyle style) {
    style.setBorderBottom(BorderStyle.THIN);
    style.setBorderTop(BorderStyle.THIN);
    style.setBorderLeft(BorderStyle.THIN);
    style.setBorderRight(BorderStyle.THIN);
  }

  private int mapDayToColumn(DayOfWeek day) {
    return switch (day) {
      case MONDAY -> 1;
      case TUESDAY -> 2;
      case WEDNESDAY -> 3;
      case THURSDAY -> 4;
      case FRIDAY -> 5;
      default -> -1;
    };
  }

  private DayOfWeek mapIntToDayOfWeek(int day) {
    return switch (day) {
      case 1 -> DayOfWeek.MONDAY;
      case 2 -> DayOfWeek.TUESDAY;
      case 3 -> DayOfWeek.WEDNESDAY;
      case 4 -> DayOfWeek.THURSDAY;
      case 5 -> DayOfWeek.FRIDAY;
      default -> null;
    };
  }

  private int[] calculateRowsForTime(LocalTime start, LocalTime end) {
    LocalTime time = START_TIME;
    int startRow = 2;
    while (time.plusMinutes(TIME_STEP_MINUTES).isBefore(start.plusSeconds(1))) {
      time = time.plusMinutes(TIME_STEP_MINUTES);
      startRow++;
    }

    int endRow = startRow;
    while (time.isBefore(end)) {
      time = time.plusMinutes(TIME_STEP_MINUTES);
      endRow++;
    }
    return new int[] {startRow, endRow - 1};
  }

  private void adjustSizes(Sheet sheet) {
    sheet.setColumnWidth(0, TIME_COLUMN_WIDTH);
    for (int c = 1; c <= NUMBER_OF_DAYS; c++) {
      sheet.setColumnWidth(c, DAY_COLUMN_WIDTH);
    }
    for (int r = 2; r <= sheet.getLastRowNum(); r++) {
      Row row = sheet.getRow(r);
      if (row != null) row.setHeightInPoints(ROW_HEIGHT_POINTS);
    }
  }

  private Sheet createSheetWithName(Workbook workbook, String entityName) {
    return workbook.createSheet(SHEET_NAME + " " + entityName);
  }
}
