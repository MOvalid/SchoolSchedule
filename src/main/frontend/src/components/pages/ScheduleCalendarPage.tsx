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
    TextField
} from '@mui/material';
import { ScheduleSlotDto, Slot } from '../../types/types';
import { EntityType } from '../../types/entityTypes';
import plLocale from '@fullcalendar/core/locales/pl';
import { convertScheduleSlotDto } from '../../utils/ScheduleSlotConverter'
import { addTimezoneOffsetToTime } from '../../utils/DateUtils'
import { useSchedule } from '../../hooks/useSchedules';

interface LocationState {
  entityType: EntityType;
  entityId: number;
  name: string;
}

const ScheduleCalendarPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { entityType, entityId, name } = location.state as LocationState;

  const [events, setEvents] = useState<Slot[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Slot | null>(null);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');

  const { data: rawSchedule = [], isLoading, error } = useSchedule(entityType, entityId);

  useEffect(() => {
      if (rawSchedule.length) {
        setEvents(rawSchedule.map(convertScheduleSlotDto));
      }
  }, [rawSchedule]);

  const handleEventClick = (arg: any) => {
    if (!editMode) return;

    const event = events.find(e => e.id === arg.event.id);
    if (event) {
      setSelectedEvent(event);
      const normalizedStart = event.start.slice(11, 16)
      const normalizedEnd = event.end.slice(11, 16)
      setStartInput(normalizedStart); // HH:mm
      setEndInput(normalizedEnd);     // HH:mm
    }
  };

  const handleSaveEdit = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map(ev => {
      if (ev.id === selectedEvent.id) {
        const day = new Date(selectedEvent.start);
        const dateString = day.toISOString().split('T')[0];

        return {
          ...ev,
          start: `${dateString}T${startInput}:00`,
          end: `${dateString}T${endInput}:00`,
        };
      }
      return ev;
    });

    setEvents(updatedEvents);
    setSelectedEvent(null);
  };

  if (isLoading) return <Typography>Ładowanie grafiku...</Typography>;
  if (error) return <Typography color="error">Błąd ładowania grafiku: {error.message}</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Grafik: {name}
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" color="primary" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Zakończ edycję' : 'Edytuj'}
        </Button>
        <Button variant="contained" color="error">Wyczyść</Button>
        <Button variant="contained" color="secondary" onClick={() => window.print()}>Drukuj</Button>
        <Button variant="outlined" color="info" onClick={() => navigate(-1)}>Powrót</Button>
      </Stack>

      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
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
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />

      {/* Edycja wydarzenia */}
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Edytuj zajęcia</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleSaveEdit} variant="contained">Zapisz</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleCalendarPage;