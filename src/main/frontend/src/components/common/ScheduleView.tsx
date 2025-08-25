import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {EventChangeArg, EventClickArg} from '@fullcalendar/core';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ScheduleSlotDto } from '../../types/types';

interface ScheduleViewProps {
    initialEvents: ScheduleSlotDto[];
    onUpdateEvent?: (_: ScheduleSlotDto) => void;
    onClear?: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ initialEvents, onUpdateEvent, onClear }) => {
    const calendarRef = useRef<FullCalendar>(null);
    const [events, setEvents] = useState(initialEvents);

    const handleEventChange = (changeInfo: EventChangeArg) => {
        const updatedEvent = {
            ...changeInfo.event.extendedProps,
            id: Number(changeInfo.event.id),
            startTime: changeInfo.event.start?.toISOString(),
            endTime: changeInfo.event.end?.toISOString(),
        };
        if (onUpdateEvent) onUpdateEvent(updatedEvent);
        setEvents((prev) => prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        alert(`Kliknięto wydarzenie: ${clickInfo.event.title}`);
        // Możesz otworzyć modal edycji tutaj
    };

    const handleClear = () => {
        setEvents([]);
        onClear?.();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
                Widok grafiku
            </Typography>

            <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => calendarRef.current?.getApi().today()}
                >
                    Pokaż dzisiaj
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClear}>
                    Wyczyść grafik
                </Button>
                <Button variant="outlined" color="info" onClick={handlePrint}>
                    Drukuj grafik
                </Button>
            </Stack>

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                editable={true}
                selectable={true}
                events={events.map((ev) => ({
                    id: ev.id?.toString(),
                    title: ev.studentId ? `Uczeń #${ev.studentId}` : `Klasa #${ev.studentClassId}`,
                    start: ev.startTime,
                    end: ev.endTime,
                    extendedProps: ev,
                }))}
                eventClick={handleEventClick}
                eventChange={handleEventChange}
                height="auto"
            />
        </Box>
    );
};

export default ScheduleView;
