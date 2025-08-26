import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { RoomDto, Slot, SlotFormValues, StudentDto, TherapistDto } from '../../types/types';
import { EntityTypes } from '../../types/entityTypes';
import {
    useCreateStudentScheduleSlot,
    useDeleteScheduleSlotForAll,
    useDeleteScheduleSlotForStudent,
    useSchedule,
    useUpdateScheduleSlotForAll,
    useUpdateScheduleSlotForStudent,
} from '../../hooks/useSchedules';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllRooms } from '../../services/RoomService';
import {
    convertFormValuesToScheduleSlotDto,
    convertScheduleSlotDto,
} from '../../utils/ScheduleSlotConverter';
import ActionButtons from './ActionButtons';
import ScheduleCalendar from './ScheduleCalendar';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import SlotDetailsManager from './SlotDetailsManager';
import { getAllStudents } from '../../services/StudentService';

interface LocationState {
    entityType: EntityTypes;
    entityId: number;
    name: string;
}

export const StudentScheduleCalendarPage: React.FC = () => {
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
        applyToAll: true,
    });
    const [therapists, setTherapists] = useState<TherapistDto[]>([]);
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [students, setStudents] = useState<StudentDto[]>([]);

    const { data: rawSchedule = [], isLoading, error } = useSchedule(entityType, studentId);
    const createSlot = useCreateStudentScheduleSlot();

    const updateSlotForAll = useUpdateScheduleSlotForAll(entityType, studentId);
    const updateSlotForStudent = useUpdateScheduleSlotForStudent(entityType, studentId);

    const deleteSlotForAll = useDeleteScheduleSlotForAll(entityType, studentId);
    const deleteSlotForStudent = useDeleteScheduleSlotForStudent(entityType, studentId);

    const editSlot = (slot: Slot, formValues: SlotFormValues) => {
        const dto = convertFormValuesToScheduleSlotDto(formValues);

        if (slot.slotId) {
            if (formValues.applyToAll) {
                updateSlotForAll.mutate({ id: slot.slotId, data: dto });
            } else {
                updateSlotForStudent.mutate({ id: slot.slotId, studentId, data: dto });
            }
        } else {
            createSlot.mutate({ studentId, data: dto });
        }
    };

    useEffect(() => {
        getAllTherapists().then((res) => setTherapists(res.data));
        getAllRooms().then((res) => setRooms(res.data));
        if (entityType === EntityTypes.Therapist) {
            getAllStudents().then((res) => setStudents(res.data));
        }
    }, [entityType]);

    useEffect(() => {
        if (rawSchedule.length) setEvents(rawSchedule.map(convertScheduleSlotDto));
    }, [
        rawSchedule,
        useDeleteScheduleSlotForStudent,
        useDeleteScheduleSlotForAll,
        useCreateStudentScheduleSlot,
    ]);

    const handleEventClick = (arg: EventClickArg) => {
        const event = events.find((e) => e.id === arg.event.id);
        if (!event) return;

        setSelectedSlot(event);
        setFormValues({
            title: event.title || '',
            start: event.start,
            end: event.end,
            therapistId: event.therapistId,
            roomId: event.roomId,
            studentIds: event.studentIds ?? [studentId],
            studentClassId: event.studentClassId,
            applyToAll: true,
        });
    };

    const deleteSlot = (slot: Slot, applyToAll: boolean) => {
        if (!slot.slotId) return;

        if (applyToAll) {
            deleteSlotForAll.mutate({ id: slot.slotId });
        } else {
            deleteSlotForStudent.mutate({ id: slot.slotId, studentId });
        }
    };

    const handleDateClick = (arg: DateClickArg) => {
        if (!editMode) return;

        const startDateTime = arg.dateStr;
        const endDateTime = new Date(arg.date);
        endDateTime.setHours(endDateTime.getHours() + 1);

        const newSlot: Slot = {
            id: `new-${Date.now()}`,
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
            studentIds: [],
            studentClassId: undefined,
        };

        setSelectedSlot(newSlot);
        setFormValues({
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
            roomId: undefined,
            studentIds: [studentId],
            studentClassId: undefined,
            applyToAll: true,
        });

        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('openSlotDialog'));
        }, 0);
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

            <SlotDetailsManager
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                therapists={therapists}
                rooms={rooms}
                students={students}
                entityType={entityType}
                studentId={studentId}
                editSlot={editSlot}
                deleteSlot={deleteSlot}
                formValues={formValues}
                setFormValues={setFormValues}
            />
        </Box>
    );
};
