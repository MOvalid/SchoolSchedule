import { ScheduleSlotDto, Slot, SlotFormValues } from '../types/types';

/**
 * Zwraca datę poniedziałku aktualnego tygodnia w UTC.
 * Poniedziałek jest uznawany za pierwszy dzień tygodnia.
 *
 * @returns {Date} Data poniedziałku w UTC z godziną ustawioną na 00:00:00.000
 */
const getMondayOfCurrentWeekUTC = (): Date => {
    const now = new Date();
    const utcDay = now.getUTCDay();
    const diff = (utcDay === 0 ? -6 : 1) - utcDay;
    now.setUTCDate(now.getUTCDate() + diff);
    now.setUTCHours(0, 0, 0, 0);
    return now;
};

/**
 * Tworzy datę i czas w formacie ISO (UTC) na podstawie poniedziałku tygodnia,
 * numeru dnia tygodnia i czasu w formacie "HH:mm:ss" lub "HH:mm".
 *
 * @param {Date} mondayUTC - Data poniedziałku w UTC
 * @param {number} dayOfWeek - Numer dnia tygodnia (1 = poniedziałek, 7 = niedziela)
 * @param {string} timeStr - Czas w formacie "HH:mm" lub "HH:mm:ss"
 * @returns {string} Data i czas w formacie ISO 8601 (UTC)
 */
const createUTCDateTime = (mondayUTC: Date, dayOfWeek: number, timeStr: string): string => {
    const [hour, minute, second = '0'] = timeStr.split(':');
    const date = new Date(
        Date.UTC(
            mondayUTC.getUTCFullYear(),
            mondayUTC.getUTCMonth(),
            mondayUTC.getUTCDate() + (dayOfWeek - 1),
            Number(hour),
            Number(minute),
            Number(second)
        )
    );
    return date.toISOString();
};

/**
 * Konwertuje obiekt DTO z backendu (ScheduleSlotDto) na obiekt Slot używany w frontendzie.
 * Generuje unikalne ID dla FullCalendar oraz przekształca daty start i end do ISO UTC.
 *
 * @param {ScheduleSlotDto} slot - Obiekt z backendu do konwersji
 * @returns {Slot} Obiekt gotowy do użycia w frontendzie / FullCalendar
 */
export const convertScheduleSlotDto = (slot: ScheduleSlotDto): Slot => {
    const mondayUTC = getMondayOfCurrentWeekUTC();
    return {
        id: crypto.randomUUID(), // unikalne ID dla FullCalendar
        slotId: slot.id, // ID z backendu
        title: slot.title ?? 'Zajęcia',
        start: createUTCDateTime(mondayUTC, slot.dayOfWeek, slot.startTime),
        end: createUTCDateTime(mondayUTC, slot.dayOfWeek, slot.endTime),
        therapistId: slot.therapistId,
        roomId: slot.roomId,
        studentIds: slot.studentIds,
        studentClassId: slot.studentClassId,
    };
};

/**
 * Konwertuje wartości formularza frontendowego (SlotFormValues) na DTO do wysłania na backend.
 * Wyciąga dzień tygodnia z daty startu.
 *
 * @param {SlotFormValues} formValues - Wartości formularza do konwersji
 * @returns {ScheduleSlotDto} Obiekt DTO gotowy do wysłania na backend
 */
export const convertFormValuesToScheduleSlotDto = (formValues: SlotFormValues): ScheduleSlotDto => {
    return {
        title: formValues.title,
        startTime: formValues.start,
        endTime: formValues.end,
        dayOfWeek: new Date(formValues.start).getDay(),
        therapistId: formValues.therapistId,
        roomId: formValues.roomId,
        studentIds: formValues.studentIds,
        studentClassId: formValues.studentClassId,
    };
};
