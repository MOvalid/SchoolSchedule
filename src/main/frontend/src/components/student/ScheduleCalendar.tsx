import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import plLocale from '@fullcalendar/core/locales/pl';
import { Slot, TherapistDto } from '../../types/types';
import { EventClickArg } from '@fullcalendar/core';

interface Props {
    events: Slot[];
    therapists: TherapistDto[];
    editMode: boolean;
    onEventClick: (arg: EventClickArg) => void;
    onDateClick: (arg: DateClickArg) => void;
}

const ScheduleCalendar: React.FC<Props> = ({
    events,
    therapists,
    editMode,
    onEventClick,
    onDateClick,
}) => {
    const calendarRef = useRef<FullCalendar>(null);

    return (
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
                title: `${e.title || ''}${e.therapistId ? ` (${therapists.find((t) => t.id === e.therapistId)?.firstName} ${therapists.find((t) => t.id === e.therapistId)?.lastName})` : ''}`,
            }))}
        />
    );
};

export default ScheduleCalendar;
