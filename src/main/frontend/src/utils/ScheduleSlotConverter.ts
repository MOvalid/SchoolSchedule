import { ScheduleSlotDto, Slot } from '../types/types';

const getMondayOfCurrentWeekUTC = (): Date => {
    const now = new Date();
    const utcDay = now.getUTCDay(); // 0 (niedziela) - 6 (sobota)
    const diff = (utcDay === 0 ? -6 : 1) - utcDay;
    now.setUTCDate(now.getUTCDate() + diff);
    now.setUTCHours(0, 0, 0, 0);
    return now;
};

const createUTCDateTime = (mondayUTC: Date, dayOfWeek: number, timeStr: string): string => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date(
        Date.UTC(
            mondayUTC.getUTCFullYear(),
            mondayUTC.getUTCMonth(),
            mondayUTC.getUTCDate() + (dayOfWeek - 1),
            hour,
            minute,
            0,
            0
        )
    );
    return date.toISOString(); // zawsze UTC
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
