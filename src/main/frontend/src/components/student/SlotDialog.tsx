import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    ListItemText,
} from '@mui/material';
import { Slot, SlotFormValues, TherapistDto, RoomDto, StudentDto } from '../../types/types';
import { toISOTime } from '../../utils/DateUtils';
import { EntityTypes } from '../../types/entityTypes';

interface Props {
    open: boolean;
    slot: Slot | null;
    formValues: SlotFormValues;
    setFormValues: (val: SlotFormValues) => void;
    onClose: () => void;
    onSave: () => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    students: StudentDto[];
    entityType: EntityTypes;
    errorMessage?: string | null;
    saving?: boolean;
}

const SlotDialog: React.FC<Props> = ({
    open,
    slot,
    formValues,
    setFormValues,
    onClose,
    onSave,
    therapists,
    rooms,
    students,
    entityType,
    errorMessage,
    saving,
}) => {
    const handleTimeChange = (field: 'start' | 'end', value: string) => {
        const datePart = formValues[field].slice(0, 10);
        setFormValues({
            ...formValues,
            [field]: toISOTime(datePart, value),
        });
    };
    console.log(entityType);

    if (!slot) return null;

    return (
        <Dialog open={open} onClose={onClose}>
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
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                />
                <TextField
                    label="Godzina zakończenia"
                    type="time"
                    fullWidth
                    margin="dense"
                    value={formValues.end.slice(11, 16)}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                />

                {entityType === EntityTypes.Therapist && (
                    <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
                        <InputLabel id="students-label">Uczniowie</InputLabel>
                        <Select
                            labelId="students-label"
                            multiple
                            value={formValues.studentIds}
                            onChange={(e) =>
                                setFormValues({
                                    ...formValues,
                                    studentIds: e.target.value as number[],
                                })
                            }
                            renderValue={(selected) =>
                                students
                                    .filter((s) => selected.includes(s.id))
                                    .map((s) => `${s.firstName} ${s.lastName}`)
                                    .join(', ')
                            }
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    <Checkbox
                                        checked={formValues.studentIds.includes(student.id)}
                                    />
                                    <ListItemText
                                        primary={`${student.firstName} ${student.lastName}`}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formValues.applyToAll}
                            onChange={(e) =>
                                setFormValues({ ...formValues, applyToAll: e.target.checked })
                            }
                        />
                    }
                    label="Zastosuj zmiany dla wszystkich uczniów"
                />

                {errorMessage && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errorMessage}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anuluj</Button>
                <Button onClick={onSave} variant="contained" disabled={saving}>
                    Zapisz
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SlotDialog;
