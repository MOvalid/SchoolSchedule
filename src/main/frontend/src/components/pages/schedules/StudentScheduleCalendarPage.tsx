import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
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
import { RoomDto, ScheduleSlotDto, Slot, SlotFormValues, TherapistDto } from '../../../types/types';
import { EntityType } from '../../../types/entityTypes';
import plLocale from '@fullcalendar/core/locales/pl';
import {
    convertFormValuesToScheduleSlotDto,
    convertScheduleSlotDto2,
} from '../../../utils/ScheduleSlotConverter';
import {
    useCreateStudentScheduleSlot,
    useSchedule,
    useUpdateScheduleSlot,
} from '../../../hooks/useSchedules';
import { getAllTherapists } from '../../../services/TherapistService';
import { getAllRooms } from '../../../services/RoomService';

interface LocationState {
    entityType: EntityType;
    entityId: number;
    name: string;
}

const StudentScheduleCalendarPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const calendarRef = useRef<FullCalendar>(null);

    const { entityType, entityId: studentId, name } = location.state as LocationState;

    const [events, setEvents] = useState<Slot[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [formValues, setFormValues] = useState<SlotFormValues>({
        title: '',
        start: '',
        end: '',
        therapistId: undefined,
        roomId: undefined,
        studentId: undefined,
        studentClassId: undefined,
    });
    const [therapists, setTherapists] = useState<TherapistDto[]>([]);
    const [rooms, setRooms] = useState<RoomDto[]>([]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data: rawSchedule = [], isLoading, error } = useSchedule(entityType, studentId);
    const updateSchedule = useUpdateScheduleSlot((msg) => setErrorMessage(msg));

    const createSlot = useCreateStudentScheduleSlot((msg) => setErrorMessage(msg));

    useEffect(() => {
        getAllTherapists().then((res) => setTherapists(res.data));
    }, []);

    useEffect(() => {
        getAllRooms().then((res) => setRooms(res.data));
    }, []);

    useEffect(() => {
        if (rawSchedule.length) {
            setEvents(rawSchedule.map(convertScheduleSlotDto2));
        }
    }, [rawSchedule]);

    const handleEventClick = (arg: EventClickArg) => {
        if (!editMode) return;

        const event = events.find((e) => e.id === arg.event.id);
        if (event) {
            setSelectedSlot(event);
            setFormValues({
                title: event.title || '',
                start: event.start,
                end: event.end,
                therapistId: event.therapistId,
                roomId: event.roomId,
                studentId: studentId,
                // studentClassId: event.studentClassId,
            });
        }
    };

    const handleDateClick = (arg: DateClickArg) => {
        if (!editMode) return;

        const startDateTime = arg.dateStr;
        const endDateTime = new Date(arg.date);
        endDateTime.setHours(endDateTime.getHours() + 1);

        setSelectedSlot({
            id: `new-${Date.now()}`,
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
        });

        setFormValues({
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
        });
        setErrorMessage(null);
    };

    const handleSaveEdit = () => {
        if (!formValues) return;
        const dto: ScheduleSlotDto = convertFormValuesToScheduleSlotDto(formValues);
        dto.studentId = Number(studentId);
        const slotId = selectedSlot?.slotId;

        console.log(dto.studentId);
        console.log(typeof dto.studentId);

        if (slotId) {
            updateSchedule.mutate({ id: slotId, data: dto });
            setSelectedSlot(null);
        } else if (studentId) {
            createSlot.mutate({ studentId: studentId, data: dto });
            setSelectedSlot(null);
        } else {
            setErrorMessage('Nie można utworzyć slotu – brak ID studenta');
        }
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
                ref={calendarRef}
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
            <Dialog open={!!selectedSlot} onClose={() => setSelectedSlot(null)}>
                <DialogTitle>Edytuj zajęcia</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nazwa zajęć"
                        fullWidth
                        margin="dense"
                        value={formValues.title}
                        onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    />
                    <TextField
                        label="Terapeuta"
                        select
                        fullWidth
                        margin="dense"
                        value={formValues.therapistId}
                        onChange={(e) =>
                            setFormValues({ ...formValues, therapistId: Number(e.target.value) })
                        }
                    >
                        {therapists.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.firstName} {t.lastName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Sala"
                        select
                        fullWidth
                        margin="dense"
                        value={formValues.roomId}
                        onChange={(e) =>
                            setFormValues({ ...formValues, roomId: Number(e.target.value) })
                        }
                    >
                        {rooms.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Godzina rozpoczęcia"
                        type="time"
                        fullWidth
                        margin="dense"
                        value={formValues.start.slice(11, 16)}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                start: formValues.start.slice(0, 11) + e.target.value,
                            })
                        }
                    />
                    <TextField
                        label="Godzina zakończenia"
                        type="time"
                        fullWidth
                        margin="dense"
                        value={formValues.end.slice(11, 16)}
                        onChange={(e) =>
                            setFormValues({
                                ...formValues,
                                end: formValues.end.slice(0, 11) + e.target.value,
                            })
                        }
                    />

                    {errorMessage && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedSlot(null)}>Anuluj</Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        disabled={updateSchedule.isPending || createSlot.isPending}
                    >
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentScheduleCalendarPage;
