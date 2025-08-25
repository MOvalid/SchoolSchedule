import { ScheduleSlotDto, Slot, SlotFormValues } from '../types/types';

const getMondayOfCurrentWeekUTC = (): Date => {
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0 (niedziela) - 6 (sobota)
    const diff = (utcDay === 0 ? -6 : 1) - utcDay;
    now.setUTCDate(now.getUTCDate() + diff);
    now.setUTCHours(0, 0, 0, 0);
    return now;
};

const createUTCDateTime = (mondayUTC: Date, dayOfWeek: number, timeStr: string): string => {
    console.log(mondayUTC);
    console.log(dayOfWeek);
    console.log(timeStr);
    const [hour, minute, second = '0'] = timeStr.split(':');
    console.log(hour);
    console.log(minute);
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

export const convertScheduleSlotDto = (slot: ScheduleSlotDto): Slot => {
    const mondayUTC = getMondayOfCurrentWeekUTC();

    return {
        id: slot.id?.toString() ?? crypto.randomUUID(),
        title: slot.title ?? 'Zajęcia',
        start: createUTCDateTime(mondayUTC, slot.dayOfWeek, slot.startTime),
        end: createUTCDateTime(mondayUTC, slot.dayOfWeek, slot.endTime),
    };
};

export const convertScheduleSlotDto2 = (slot: ScheduleSlotDto): Slot => {
    const mondayUTC = getMondayOfCurrentWeekUTC();
    return {
        id: crypto.randomUUID(), // FullCalendar ID
        slotId: slot.id, // backend ID
        title: slot.title ?? 'Zajęcia',
        start: createUTCDateTime(mondayUTC, slot.dayOfWeek, slot.startTime),
        end: createUTCDateTime(mondayUTC, slot.dayOfWeek, slot.endTime),
        therapistId: slot.therapistId,
        roomId: slot.roomId,
        studentId: slot.studentId,
        studentClassId: slot.studentClassId,
    };
};

export const convertFormValuesToScheduleSlotDto = (formValues: SlotFormValues): ScheduleSlotDto => {
    return {
        title: formValues.title,
        startTime: formValues.start,
        endTime: formValues.end,
        dayOfWeek: new Date(formValues.start).getDay(),
        therapistId: formValues.therapistId,
        roomId: formValues.roomId,
        studentId: formValues.studentId,
        studentClassId: formValues.studentClassId,
    };
};
