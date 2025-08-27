package com.MSPDiON.SchoolSchedule.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CreateScheduleSlotDto {

    @NotBlank(message = "Tytuł slotu jest wymagany")
    private String title;

    private Long therapistId;

    private Long studentId;

    private Long studentClassId;

    private List<@NotNull(message = "Id ucznia nie może być null") Long> studentIds;

    private Long roomId;

    @Min(value = 1, message = "Dzień tygodnia musi być od 1 do 7")
    @Max(value = 7, message = "Dzień tygodnia musi być od 1 do 7")
    private int dayOfWeek;

    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Godzina rozpoczęcia musi być w formacie HH:mm")
    private String startTime;

    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Godzina zakończenia musi być w formacie HH:mm")
    private String endTime;
}
