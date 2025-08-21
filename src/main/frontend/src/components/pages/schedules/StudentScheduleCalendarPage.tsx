import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
    Box,
    Button,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material';
import { ScheduleSlotDto, Slot, TherapistDto } from '../../../types/types';
import { EntityType } from '../../../types/entityTypes';
import plLocale from '@fullcalendar/core/locales/pl';
import { convertScheduleSlotDto } from '../../../utils/ScheduleSlotConverter';
import { useSchedule } from '../../../hooks/useSchedules';
import { getAllTherapists } from '../../../services/TherapistService';

interface LocationState {
    entityType: EntityType;
    entityId: number;
    name: string;
}

const StudentScheduleCalendarPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { entityType, entityId, name } = location.state as LocationState;

    const [events, setEvents] = useState<Slot[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Slot | null>(null);
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [therapistId, setTherapistId] = useState<number | undefined>(undefined);
    const [therapists, setTherapists] = useState<TherapistDto[]>([]);

    const { data: rawSchedule = [], isLoading, error } = useSchedule(entityType, entityId);

    useEffect(() => {
        getAllTherapists().then((res) => setTherapists(res.data));
    }, []);

    useEffect(() => {
        if (rawSchedule.length) {
            setEvents(rawSchedule.map(convertScheduleSlotDto));
        }
    }, [rawSchedule]);

    const handleEventClick = (arg: any) => {
        if (!editMode) return;

        const event = events.find((e) => e.id === arg.event.id);
        if (event) {
            setSelectedEvent(event);
            const normalizedStart = event.start.slice(11, 16);
            const normalizedEnd = event.end.slice(11, 16);
            setStartInput(normalizedStart);
            setEndInput(normalizedEnd);
            setTitleInput(event.title || '');
            setTherapistId(event.therapistId);
        }
    };

    const handleSaveEdit = () => {
        if (!selectedEvent) return;

        const day = new Date(selectedEvent.start);
        const dateString = day.toISOString().split('T')[0];

        const updatedEvent: Slot = {
            ...selectedEvent,
            start: `${dateString}T${startInput}:00`,
            end: `${dateString}T${endInput}:00`,
            title: titleInput,
            therapistId: therapistId,
        };

        setEvents((prevEvents) => {
            const exists = prevEvents.find((ev) => ev.id === selectedEvent.id);
            if (exists) {
                return prevEvents.map((ev) => (ev.id === selectedEvent.id ? updatedEvent : ev));
            } else {
                return [...prevEvents, updatedEvent];
            }
        });

        setSelectedEvent(null);
    };

    const handleDateClick = (arg: any) => {
        if (!editMode) return;

        const startDateTime = arg.dateStr;
        const endDateTime = new Date(arg.date);
        endDateTime.setHours(endDateTime.getHours() + 1);

        setSelectedEvent({
            id: `new-${Date.now()}`,
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
        });
        setStartInput(startDateTime.slice(11, 16));
        setEndInput(endDateTime.toISOString().slice(11, 16));
        setTitleInput('');
        setTherapistId(undefined);
    };

    if (isLoading) return <Typography>Ładowanie grafiku...</Typography>;
    if (error)
        return <Typography color="error">Błąd ładowania grafiku: {error.message}</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Grafik: {name}
            </Typography>

            <Stack direction="row" spacing={2} mb={2}>
                <Button variant="contained" color="primary" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Zakończ edycję' : 'Edytuj'}
                </Button>
                <Button variant="contained" color="error">
                    Wyczyść
                </Button>
                <Button variant="contained" color="secondary" onClick={() => window.print()}>
                    Drukuj
                </Button>
                <Button variant="outlined" color="info" onClick={() => navigate(-1)}>
                    Powrót
                </Button>
            </Stack>

            <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                initialView="timeGridWeek"
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
                events={events.map((e) => ({
                    ...e,
                    title: `${e.title || ''}${e.therapistId ? ` (${therapists.find((t) => t.id === e.therapistId)?.firstName} ${therapists.find((t) => t.id === e.therapistId)?.lastName})` : ''}`,
                }))}
                eventClick={handleEventClick}
                height="auto"
            />

            {/* Edycja wydarzenia */}
            <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
                <DialogTitle>Edytuj zajęcia</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nazwa zajęć"
                        fullWidth
                        margin="dense"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                    />
                    <TextField
                        label="Terapeuta"
                        select
                        fullWidth
                        margin="dense"
                        value={therapistId}
                        onChange={(e) => setTherapistId(Number(e.target.value))}
                    >
                        {therapists.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.firstName} {t.lastName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Godzina rozpoczęcia"
                        type="time"
                        fullWidth
                        margin="dense"
                        value={startInput}
                        onChange={(e) => setStartInput(e.target.value)}
                    />
                    <TextField
                        label="Godzina zakończenia"
                        type="time"
                        fullWidth
                        margin="dense"
                        value={endInput}
                        onChange={(e) => setEndInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedEvent(null)}>Anuluj</Button>
                    <Button onClick={handleSaveEdit} variant="contained">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentScheduleCalendarPage;
