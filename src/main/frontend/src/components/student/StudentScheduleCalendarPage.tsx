import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Slot, SlotFormValues, ScheduleSlotDto, TherapistDto, RoomDto } from '../../types/types';
import { EntityType } from '../../types/entityTypes';
import {
    useSchedule,
    useCreateStudentScheduleSlot,
    useUpdateScheduleSlot,
} from '../../hooks/useSchedules';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllRooms } from '../../services/RoomService';
import {
    convertFormValuesToScheduleSlotDto,
    convertScheduleSlotDto2,
} from '../../utils/ScheduleSlotConverter';
import ActionButtons from './ActionButtons';
import ScheduleCalendar from './ScheduleCalendar';
import SlotDialog from './SlotDialog';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

interface LocationState {
    entityType: EntityType;
    entityId: number;
    name: string;
}

const StudentScheduleCalendarPage: React.FC = () => {
    const location = useLocation();
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
        studentIds: [],
        studentClassId: undefined,
    });
    const [therapists, setTherapists] = useState<TherapistDto[]>([]);
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data: rawSchedule = [], isLoading, error } = useSchedule(entityType, studentId);
    const updateSchedule = useUpdateScheduleSlot(entityType, studentId);
    const createSlot = useCreateStudentScheduleSlot();

    useEffect(() => {
        getAllTherapists().then((res) => setTherapists(res.data));
        getAllRooms().then((res) => setRooms(res.data));
    }, []);

    useEffect(() => {
        if (rawSchedule.length) setEvents(rawSchedule.map(convertScheduleSlotDto2));
    }, [rawSchedule]);

    const handleMutationError = (error: unknown) => {
        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                alert(error.response.data?.message || 'Conflict occurred while saving slot.');
            } else {
                setErrorMessage(
                    error.response?.data?.message || 'Nieoczekiwany błąd podczas zapisu.'
                );
            }
        } else if (error instanceof Error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage('Nieoczekiwany błąd podczas zapisu.');
        }
    };

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
                studentIds: selectedSlot?.studentIds ?? [studentId],
                studentClassId: event.studentClassId,
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
            studentIds: [],
            studentClassId: undefined,
        });

        setFormValues({
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
            studentIds: [],
            studentClassId: undefined,
        });
        setErrorMessage(null);
    };

    const handleSaveEdit = () => {
        if (!formValues) return;
        const dto: ScheduleSlotDto = convertFormValuesToScheduleSlotDto(formValues);
        dto.studentIds = [Number(studentId)];
        const slotId = selectedSlot?.slotId;

        if (slotId) {
            updateSchedule.mutate({ id: slotId, data: dto }, { onError: handleMutationError });
            setSelectedSlot(null);
        } else if (studentId) {
            createSlot.mutate({ studentId, data: dto }, { onError: handleMutationError });
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

            <ActionButtons editMode={editMode} setEditMode={setEditMode} />

            <ScheduleCalendar
                events={events}
                therapists={therapists}
                editMode={editMode}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
            />

            <SlotDialog
                open={!!selectedSlot}
                slot={selectedSlot}
                formValues={formValues}
                setFormValues={setFormValues}
                onClose={() => setSelectedSlot(null)}
                onSave={handleSaveEdit}
                therapists={therapists}
                rooms={rooms}
                errorMessage={errorMessage}
                saving={updateSchedule.isPending || createSlot.isPending}
            />
        </Box>
    );
};

export default StudentScheduleCalendarPage;
