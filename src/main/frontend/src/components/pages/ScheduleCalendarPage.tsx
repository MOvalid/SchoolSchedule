import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
    Slot,
    SlotFormValues,
    StudentDto,
    TherapistDto,
    RoomDto,
    StudentClassDto,
} from '../../types/types';
import { EntityTypes } from '../../types/enums/entityTypes';
import {
    useCreateScheduleSlot,
    useDeleteScheduleSlotForAll,
    useDeleteScheduleSlotForEntity,
    useSchedule,
    useUpdateScheduleSlotForAll,
    useUpdateScheduleSlotForEntity,
} from '../../hooks/useSchedules';
import { getAllStudents } from '../../services/StudentService';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllRooms } from '../../services/RoomService';
import {
    convertFormValuesToScheduleSlotDto,
    convertScheduleSlotDto,
} from '../../utils/ScheduleSlotConverter';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import ActionButtons from '../common/ActionButtons';
import ScheduleCalendar from '../common/ScheduleCalendar';
import SlotDetailsManager from '../slots/SlotDetailsManager';
import { getAllClasses } from '../../services/StudentClassService';

interface LocationState {
    entityType: EntityTypes;
    entityId: number;
    name: string;
}

export const ScheduleCalendarPage: React.FC = () => {
    const location = useLocation();
    const { entityType, entityId, name } = location.state as LocationState;

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
    const [studentClasses, setStudentClasses] = useState<StudentClassDto[]>([]);

    const { data: rawSchedule = [], isLoading, error } = useSchedule(entityType, entityId);
    const createSlot = useCreateScheduleSlot(entityType, entityId);
    const updateSlotForAll = useUpdateScheduleSlotForAll(entityType, entityId);
    const updateSlotForEntity = useUpdateScheduleSlotForEntity(entityType, entityId);
    const deleteSlotForAll = useDeleteScheduleSlotForAll(entityType, entityId);
    const deleteSlotForEntity = useDeleteScheduleSlotForEntity(entityType, entityId);

    const handleSlotSave = (slot: Slot, values: SlotFormValues) => {
        const dto = convertFormValuesToScheduleSlotDto(values);

        if (slot.slotId) {
            if (values.applyToAll) updateSlotForAll.mutate({ id: slot.slotId, data: dto });
            else updateSlotForEntity.mutate({ id: slot.slotId, entityId, data: dto });
        } else {
            createSlot.mutate({ entityId, data: dto });
        }
    };

    const handleDeleteSlot = (slot: Slot, applyToAll: boolean) => {
        if (!slot.slotId) return;
        if (applyToAll) deleteSlotForAll.mutate({ id: slot.slotId });
        else deleteSlotForEntity.mutate({ id: slot.slotId, entityId });
    };

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
            studentIds: event.studentIds ?? (entityType === EntityTypes.Student ? [entityId] : []),
            studentClassId: event.studentClassId,
            applyToAll: true,
        });

        if (editMode) {
            setTimeout(() => document.dispatchEvent(new CustomEvent('openSlotDialog')), 0);
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
            studentIds: entityType === EntityTypes.Student ? [entityId] : [],
            studentClassId: undefined,
        };

        setSelectedSlot(newSlot);
        setFormValues({
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
            roomId: undefined,
            studentIds: entityType === EntityTypes.Student ? [entityId] : [],
            studentClassId: undefined,
            applyToAll: true,
        });

        setTimeout(() => document.dispatchEvent(new CustomEvent('openSlotDialog')), 0);
    };

    useEffect(() => {
        getAllRooms().then((res) => setRooms(res.data));
        getAllTherapists().then((res) => setTherapists(res.data));
        getAllStudents().then((res) => setStudents(res.data));
        getAllClasses().then((res) => setStudentClasses(res.data));
    }, [entityType]);

    useEffect(() => {
        setEvents(rawSchedule.map(convertScheduleSlotDto));
    }, [rawSchedule]);

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
                students={students}
                rooms={rooms}
                studentClasses={studentClasses}
                editMode={editMode}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                entityType={entityType}
            />

            <SlotDetailsManager
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                therapists={therapists}
                rooms={rooms}
                students={students}
                studentClasses={studentClasses}
                entityType={entityType}
                studentId={entityId}
                editSlot={handleSlotSave}
                deleteSlot={handleDeleteSlot}
                formValues={formValues}
                setFormValues={setFormValues}
            />
        </Box>
    );
};
