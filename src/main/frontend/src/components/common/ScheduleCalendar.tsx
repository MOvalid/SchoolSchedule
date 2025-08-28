import React, { useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import plLocale from '@fullcalendar/core/locales/pl';
import { RoomDto, Slot, StudentClassDto, StudentDto, TherapistDto } from '../../types/types';
import { EventClickArg } from '@fullcalendar/core';
import { EntityTypes } from '../../types/enums/entityTypes';
import { useTheme } from '@mui/material/styles';
import { getCalendarStyles } from '../../styles/calendar.styles';
import { Box } from '@mui/material';

interface Props {
    events: Slot[];
    therapists: TherapistDto[];
    students: StudentDto[];
    studentClasses: StudentClassDto[];
    rooms: RoomDto[];
    editMode: boolean;
    onEventClick: (arg: EventClickArg) => void;
    onDateClick: (arg: DateClickArg) => void;
    entityType: EntityTypes;
}

export const formatSlotTitle = (
    slot: Slot,
    userType: EntityTypes,
    therapistsMap: Record<number, { firstName: string; lastName: string }>,
    studentsMap: Record<number, { firstName: string; lastName: string }>,
    classesMap: Record<number, { name: string }>,
    roomsMap: Record<number, { name: string }>
) => {
    let title = slot.title || '';

    if (userType === EntityTypes.Student) {
        if (slot.therapistId) {
            const therapist = therapistsMap[slot.therapistId];
            if (therapist) {
                title += ` (${therapist.firstName} ${therapist.lastName})`;
            }
        }
    } else if (userType === EntityTypes.Therapist) {
        if (slot.studentClassId) {
            const studentClass = classesMap[slot.studentClassId];
            if (studentClass) {
                title += ` (${studentClass.name})`;
            }
        } else if (slot.studentIds && slot.studentIds.length === 1) {
            const student = studentsMap[slot.studentIds[0]];
            if (student) {
                title += ` (${student.firstName} ${student.lastName})`;
            }
        }
    }

    if (slot.roomId) {
        const room = roomsMap[slot.roomId];
        if (room) {
            title += ` - ${room.name}`;
        }
    }

    return title;
};

const ScheduleCalendar: React.FC<Props> = ({
    events,
    therapists,
    studentClasses,
    students,
    rooms,
    editMode,
    onEventClick,
    onDateClick,
    entityType,
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
    const roomsMap = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), [rooms]);

    return (
        <Box sx={getCalendarStyles(theme)}>
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
                    title: formatSlotTitle(
                        e,
                        entityType,
                        therapistsMap,
                        studentsMap,
                        classesMap,
                        roomsMap
                    ),
                }))}
            />
        </Box>
    );
};

export default ScheduleCalendar;
