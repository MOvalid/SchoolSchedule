import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Stack,
    SxProps,
    Theme,
} from '@mui/material';
import {
    Slot,
    SlotFormValues,
    TherapistDto,
    RoomDto,
    StudentDto,
    StudentClassDto,
} from '../../types/types';
import { getDateFromISO, getTimeFromISO, toISOTime } from '../../utils/DateUtils';
import { EntityTypes } from '../../types/enums/entityTypes';
import SearchSelect from '../common/SearchSelect';
import ConfirmDeleteActions from '../common/ConfirmDeleteActions';

interface Props {
    open: boolean;
    slot: Slot | null;
    formValues: SlotFormValues;
    setFormValues: (val: SlotFormValues) => void;
    onClose: () => void;
    onSave: () => Promise<void>;
    onDelete: (slot: Slot, applyToAll: boolean) => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    students: StudentDto[];
    classes: StudentClassDto[];
    entityType: EntityTypes;
    saving?: boolean;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const styles: Record<string, SxProps<Theme>> = {
    stack: { mt: 1, spacing: 2 },
    errorText: { color: 'error.main', mt: 1 },
    button: { width: '120px' },
};

const SlotDialog: React.FC<Props> = ({
    open,
    slot,
    formValues,
    setFormValues,
    onClose,
    onSave,
    onDelete,
    therapists,
    rooms,
    students,
    classes,
    entityType,
    saving,
    fieldErrors,
    setFieldErrors,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!slot) return null;

    const updateField = <K extends keyof SlotFormValues>(field: K, value: SlotFormValues[K]) => {
        setFormValues({ ...formValues, [field]: value });
        if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: '' });
    };

    const handleTimeChange = (field: 'start' | 'end', value: string) => {
        const datePart = formValues[field].slice(0, 10);
        updateField(field, toISOTime(datePart, value));
    };

    const handleDateChange = (field: 'validFrom' | 'validTo', value: string) => {
        updateField(field, value);
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

    const showApplyToAllCheckbox =
        !!slot.slotId && students.length > 1 && entityType === EntityTypes.Student;
    const showStudentSelect = entityType === EntityTypes.Therapist;
    const showClassSelect = entityType !== EntityTypes.Student;

    const handleSaveClick = async () => {
        await onSave();
    };

    const getFieldError = (field: keyof SlotFormValues) => fieldErrors[field] ?? '';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{slot.slotId ? 'Edycja zajęć' : 'Dodawanie zajęć'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={styles.stack}>
                    <TextField
                        label="Nazwa zajęć"
                        fullWidth
                        margin="dense"
                        value={formValues.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        error={!!getFieldError('title')}
                        helperText={getFieldError('title')}
                    />

                    <SearchSelect
                        label="Terapeuta"
                        items={therapistItems}
                        value={formValues.therapistId ?? null}
                        onChange={(id) => updateField('therapistId', (id as number) ?? undefined)}
                        multiple={false}
                        error={!!getFieldError('therapistId')}
                        helperText={getFieldError('therapistId')}
                    />

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
                        onChange={(e) => handleDateChange('validFrom', e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    />

                    <TextField
                        label="Data obowiązywania - do"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={getDateFromISO(formValues.validTo) || ''}
                        onChange={(e) => handleDateChange('validTo', e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
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
                            onChange={(id) =>
                                updateField('studentClassId', (id as number) ?? undefined)
                            }
                            multiple={false}
                            error={!!getFieldError('studentClassId')}
                            helperText={getFieldError('studentClassId')}
                        />
                    )}

                    {showApplyToAllCheckbox && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formValues.applyToAll}
                                    onChange={(e) => updateField('applyToAll', e.target.checked)}
                                />
                            }
                            label="Zastosuj zmiany dla wszystkich uczniów"
                        />
                    )}

                    {fieldErrors.general && (
                        <Typography sx={styles.errorText}>{fieldErrors.general}</Typography>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                {slot.slotId && (
                    <ConfirmDeleteActions
                        confirming={confirmDelete}
                        onConfirmDeleteChange={setConfirmDelete}
                        onDelete={() => onDelete(slot, formValues.applyToAll)}
                    />
                )}

                {!confirmDelete && (
                    <>
                        <Button onClick={onClose}>Powrót</Button>
                        <Button
                            onClick={handleSaveClick}
                            variant="contained"
                            disabled={saving}
                            sx={styles.button}
                        >
                            Zapisz
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SlotDialog;
