import React, { useEffect, useState } from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation } from 'react-router-dom';
import {
    StudentDto,
    TherapistDto,
    RoomDto,
    StudentClassDto,
    Slot,
    TherapistAvailabilityDto,
} from '../../types/types';
import { EntityTypes } from '../../types/enums/entityTypes';
import ActionButtons from '../common/ActionButtons';
import ScheduleCalendar from '../common/ScheduleCalendar';
import SlotDetailsManager from '../slots/SlotDetailsManager';
import ConfirmDialog from '../common/ConfirmDialog';
import { useScheduleWithDate } from '../../hooks/useSchedules';
import { useSlotManager } from '../../hooks/useSlotManager';
import { getAllRooms } from '../../services/RoomService';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllStudents } from '../../services/StudentService';
import { getAllClasses } from '../../services/StudentClassService';
import dayjs, { Dayjs } from 'dayjs';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { findTherapistById } from '../../utils/ScheduleSlotConverter';
import { useSnackbar } from '../../context/SnackbarContext';

interface LocationState {
    entityType: EntityTypes;
    entityId: number;
    name: string;
}

const calendarHeaderStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
};

export const ScheduleCalendarPage: React.FC = () => {
    const location = useLocation();
    const { entityType, entityId, name } = location.state as LocationState;

    const [therapists, setTherapists] = useState<TherapistDto[]>([]);
    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [students, setStudents] = useState<StudentDto[]>([]);
    const [studentClasses, setStudentClasses] = useState<StudentClassDto[]>([]);
    const [therapistAvailabilities, setTherapistAvailabilities] = useState<
        TherapistAvailabilityDto[]
    >([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [editMode, setEditMode] = useState(false);
    const snackbar = useSnackbar();

    const { events, isLoading, error } = useScheduleWithDate(entityType, entityId, selectedDate);
    const {
        selectedSlot,
        setSelectedSlot,
        formValues,
        setFormValues,
        handleSlotSave,
        handleDeleteSlot,
        handleClearSchedule,
    } = useSlotManager(entityType, entityId);

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
            validFrom: event.validFrom ?? '',
            validTo: event.validTo ?? '',
        });

        if (editMode) {
            setTimeout(() => document.dispatchEvent(new CustomEvent('openSlotDialog')), 0);
        }
    };

    const checkTherapistAvailability = (arg: DateClickArg) => {
        const clickedDay = arg.date.getDay();
        const clickedTime = arg.date.toTimeString().slice(0, 5);

        return therapistAvailabilities.some((a) => {
            return (
                a.dayOfWeek === clickedDay && clickedTime >= a.startTime && clickedTime < a.endTime
            );
        });
    };

    const handleDateClick = (arg: DateClickArg) => {
        if (!editMode) return;
        const isWithinAvailability = checkTherapistAvailability(arg);
        if (!isWithinAvailability) {
            snackbar.showSnackbar(
                'Nie możesz dodać zajęć poza godzinami dostępności terapeuty.',
                'warning'
            );
            return;
        }
        const startDateTime = arg.dateStr;
        const endDateTime = new Date(arg.date);
        endDateTime.setHours(endDateTime.getHours() + 1);
        const today = dayjs().format('YYYY-MM-DD');
        const newSlot: Slot = {
            id: `new-${Date.now()}`,
            title: '',
            start: startDateTime,
            end: endDateTime.toISOString(),
            therapistId: undefined,
            studentIds: entityType === EntityTypes.Student ? [entityId] : [],
            studentClassId: undefined,
            validFrom: today,
            validTo: '',
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
            validFrom: today,
            validTo: '',
        });

        setTimeout(() => document.dispatchEvent(new CustomEvent('openSlotDialog')), 0);
    };

    useEffect(() => {
        getAllRooms().then((res) => setRooms(res.data));
        getAllTherapists().then((res) => {
            setTherapists(res.data);
            if (entityType === EntityTypes.Therapist) {
                const therapist = findTherapistById(
                    res.data,
                    entityType === EntityTypes.Therapist ? entityId : -1
                );
                console.log(therapist);
                setTherapistAvailabilities(
                    therapist?.availabilities || ([] as TherapistAvailabilityDto[])
                );
            }
        });
        getAllStudents().then((res) => setStudents(res.data));
        getAllClasses().then((res) => setStudentClasses(res.data));
    }, [entityType, entityId]);

    useEffect(() => {
        console.log(therapistAvailabilities);
    }, [therapistAvailabilities]);

    if (error)
        return <Typography color="error">Błąd ładowania grafiku: {error.message}</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Grafik: {name}
            </Typography>

            <Box sx={calendarHeaderStyles}>
                <ActionButtons
                    editMode={editMode}
                    setEditMode={setEditMode}
                    onClearSchedule={() => setConfirmOpen(true)}
                />
                <DatePicker
                    label="Wybierz datę"
                    value={selectedDate}
                    onChange={(newDate) => newDate && setSelectedDate(newDate)}
                    slotProps={{ textField: { size: 'small' } }}
                />
            </Box>

            <ConfirmDialog
                open={confirmOpen}
                title="Wyczyść grafik"
                description="Czy na pewno chcesz wyczyścić cały grafik? Tej operacji nie można cofnąć."
                confirmText="Wyczyść"
                confirmColor="error"
                onConfirm={() => {
                    handleClearSchedule();
                    setConfirmOpen(false);
                }}
                onCancel={() => setConfirmOpen(false)}
            />

            <ScheduleCalendar
                events={events}
                therapists={therapists}
                students={students}
                studentClasses={studentClasses}
                availabilities={therapistAvailabilities}
                editMode={editMode}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
                entityType={entityType}
                loading={isLoading}
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
