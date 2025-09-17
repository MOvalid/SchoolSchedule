import { EntityType } from '../types/enums/entityType';
import { mapAvailabilitiesToEvents } from './ScheduleSlotConverter';
import { AvailabilityDto, BusinessHoursDto, StudentDto } from '../types/types';

export const getBusinessHours = (
    entityType: EntityType,
    availabilities?: AvailabilityDto[],
    students?: StudentDto[]
): BusinessHoursDto[] => {
    const hours: BusinessHoursDto[] = mapAvailabilitiesToEvents(availabilities);

    if (entityType === EntityType.Student && students) {
        students.forEach((student) => {
            if (student.arrivalTime && student.departureTime) {
                for (let day = 1; day <= 5; day++) {
                    hours.push({
                        daysOfWeek: [day],
                        startTime: student.arrivalTime,
                        endTime: student.departureTime,
                    });
                }
            }
        });
    }

    return hours;
};
