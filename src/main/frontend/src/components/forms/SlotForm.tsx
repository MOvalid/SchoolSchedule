import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import {
    SlotFormValues,
    TherapistDto,
    RoomDto,
    StudentDto,
    StudentClassDto,
} from '../../types/types';
import SearchSelect from '../common/SearchSelect';
import { EntityTypes } from '../../types/enums/entityTypes';
import { getDateFromISO, getTimeFromISO, toISOTime } from '../../utils/DateUtils';
import { confirmDeleteStackSx } from '../../styles/slotDetails.styles';

interface SlotFormProps {
    formValues: SlotFormValues;
    setFormValues: (val: SlotFormValues) => void;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    students: StudentDto[];
    classes: StudentClassDto[];
    entityType: EntityTypes;
    showConfirmDelete?: boolean;
}

export const SlotForm: React.FC<SlotFormProps> = ({
    formValues,
    setFormValues,
    fieldErrors,
    setFieldErrors,
    therapists,
    rooms,
    students,
    classes,
    entityType,
    showConfirmDelete = false,
}) => {
    const updateField = <K extends keyof SlotFormValues>(field: K, value: SlotFormValues[K]) => {
        setFormValues({ ...formValues, [field]: value });
        if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: '' });
    };

    const handleTimeChange = (field: 'start' | 'end', value: string) => {
        const datePart = formValues[field].slice(0, 10);
        updateField(field, toISOTime(datePart, value));
    };

    const therapistItems = therapists.map((t) => ({
        id: t.id!,
        label: `${t.firstName} ${t.lastName}`,
    }));
    const studentItems = students.map((s) => ({
        id: s.id!,
        label: `${s.firstName} ${s.lastName}`,
    }));
    const roomItems = rooms.map((r) => ({ id: r.id!, label: r.name }));
    const classItems = classes.map((c) => ({ id: c.id!, label: c.name }));

    const showStudentSelect = entityType === EntityTypes.Therapist;
    const showTherapistSelect = entityType !== EntityTypes.Therapist;
    const showClassSelect = entityType !== EntityTypes.Student;

    const getFieldError = (field: keyof SlotFormValues) => fieldErrors[field] ?? '';

    return (
        <Stack spacing={2}>
            <TextField
                label="Nazwa zajęć"
                fullWidth
                margin="dense"
                value={formValues.title}
                onChange={(e) => updateField('title', e.target.value)}
                error={!!getFieldError('title')}
                helperText={getFieldError('title')}
            />

            {showTherapistSelect && (
                <SearchSelect
                    label="Terapeuta"
                    items={therapistItems}
                    value={formValues.therapistId ?? null}
                    onChange={(id) => updateField('therapistId', (id as number) ?? undefined)}
                    multiple={false}
                    error={!!getFieldError('therapistId')}
                    helperText={getFieldError('therapistId')}
                />
            )}

            <SearchSelect
                label="Sala"
                items={roomItems}
                value={formValues.roomId ?? null}
                onChange={(id) => updateField('roomId', (id as number) ?? undefined)}
                multiple={false}
                error={!!getFieldError('roomId')}
                helperText={getFieldError('roomId')}
            />

            <TextField
                label="Godzina rozpoczęcia"
                type="time"
                fullWidth
                margin="dense"
                value={getTimeFromISO(formValues.start)}
                onChange={(e) => handleTimeChange('start', e.target.value)}
                error={!!getFieldError('start')}
                helperText={getFieldError('start')}
            />

            <TextField
                label="Godzina zakończenia"
                type="time"
                fullWidth
                margin="dense"
                value={getTimeFromISO(formValues.end)}
                onChange={(e) => handleTimeChange('end', e.target.value)}
                error={!!getFieldError('end')}
                helperText={getFieldError('end')}
            />

            <TextField
                label="Data obowiązywania - od"
                type="date"
                fullWidth
                margin="dense"
                value={getDateFromISO(formValues.validFrom) || ''}
                onChange={(e) => updateField('validFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="Data obowiązywania - do"
                type="date"
                fullWidth
                margin="dense"
                value={getDateFromISO(formValues.validTo) || ''}
                onChange={(e) => updateField('validTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
            />

            {showStudentSelect && (
                <SearchSelect
                    label="Uczniowie"
                    items={studentItems}
                    value={formValues.studentIds ?? []}
                    onChange={(ids) => updateField('studentIds', ids as number[])}
                    multiple
                    error={!!getFieldError('studentIds')}
                    helperText={getFieldError('studentIds')}
                />
            )}

            {showClassSelect && (
                <SearchSelect
                    label="Klasa"
                    items={classItems}
                    value={formValues.studentClassId ?? null}
                    onChange={(id) => updateField('studentClassId', (id as number) ?? undefined)}
                    multiple={false}
                    error={!!getFieldError('studentClassId')}
                    helperText={getFieldError('studentClassId')}
                />
            )}

            {showConfirmDelete && (
                <Stack sx={confirmDeleteStackSx}>
                    <Typography color="error" fontWeight={600}>
                        Czy na pewno chcesz usunąć ten slot?
                    </Typography>
                </Stack>
            )}

            {fieldErrors.general && <Typography color="error">{fieldErrors.general}</Typography>}
        </Stack>
    );
};
