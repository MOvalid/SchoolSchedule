import React, { useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import plLocale from '@fullcalendar/core/locales/pl';
import {
    BusinessHoursDto,
    Slot,
    StudentClassDto,
    StudentDto,
    AvailabilityDto,
    TherapistDto,
} from '../../types/types';
import { EventClickArg } from '@fullcalendar/core';
import { EntityTypes } from '../../types/enums/entityTypes';
import { useTheme } from '@mui/material/styles';
import { getCalendarStyles } from '../../styles/calendar.styles';
import { Box } from '@mui/material';
import { Spinner } from './Spinner';
import { mapAvailabilitiesToEvents } from '../../utils/ScheduleSlotConverter';

interface Props {
    events: Slot[];
    therapists: TherapistDto[];
    students: StudentDto[];
    studentClasses: StudentClassDto[];
    availabilities?: AvailabilityDto[];
    editMode: boolean;
    onEventClick: (arg: EventClickArg) => void;
    onDateClick: (arg: DateClickArg) => void;
    entityType: EntityTypes;
    loading?: boolean;
}

export const formatSlotTitle = (
    slot: Slot,
    userType: EntityTypes,
    therapistsMap: Record<number, { firstName: string; lastName: string }>,
    studentsMap: Record<number, { firstName: string; lastName: string }>,
    classesMap: Record<number, { name: string }>
) => {
    let title = slot.title || '';

    const appendName = (name?: string) => {
        if (name) title += ` (${name})`;
    };

    switch (userType) {
        case EntityTypes.Student:
            if (slot.therapistId) {
                const therapist = therapistsMap[slot.therapistId];
                appendName(therapist ? `${therapist.firstName} ${therapist.lastName}` : undefined);
            }
            break;

        case EntityTypes.Therapist:
            if (slot.studentClassId) {
                const studentClass = classesMap[slot.studentClassId];
                appendName(studentClass?.name);
            } else if (slot.studentIds?.length === 1) {
                const student = studentsMap[slot.studentIds[0]];
                appendName(student ? `${student.firstName} ${student.lastName}` : undefined);
            }
            break;
    }

    return title;
};

const ScheduleCalendar: React.FC<Props> = ({
    events,
    therapists,
    students,
    studentClasses,
    availabilities,
    editMode,
    onEventClick,
    onDateClick,
    entityType,
    loading = false,
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    const theme = useTheme();

    const therapistsMap = useMemo(
        () => Object.fromEntries(therapists.map((t) => [t.id, t])),
        [therapists]
    );
    const studentsMap = useMemo(
        () => Object.fromEntries(students.map((s) => [s.id, s])),
        [students]
    );
    const classesMap = useMemo(
        () => Object.fromEntries(studentClasses.map((c) => [c.id, c])),
        [studentClasses]
    );

    const businessHours: BusinessHoursDto[] = useMemo(() => {
        return mapAvailabilitiesToEvents(availabilities);
    }, [availabilities]);

    return (
        <Box id="calendar-container" sx={{ position: 'relative', ...getCalendarStyles(theme) }}>
            <Spinner isLoading={loading} />
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                dateClick={editMode ? onDateClick : undefined}
                eventClick={onEventClick}
                allDaySlot={false}
                slotMinTime="05:00:00"
                slotMaxTime="18:00:00"
                locale={plLocale}
                firstDay={1}
                timeZone="UTC"
                nowIndicator={false}
                headerToolbar={false}
                hiddenDays={[0, 6]}
                dayHeaderFormat={{ weekday: 'long' }}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                height="auto"
                events={events.map((e) => ({
                    ...e,
                    title: formatSlotTitle(e, entityType, therapistsMap, studentsMap, classesMap),
                }))}
                businessHours={businessHours}
            />
        </Box>
    );
};

export default ScheduleCalendar;
