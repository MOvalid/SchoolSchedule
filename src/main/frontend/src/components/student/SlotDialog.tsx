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
} from '@mui/material';
import { Slot, SlotFormValues, TherapistDto, RoomDto } from '../../types/types';
import { toISOTime } from '../../utils/DateUtils';

interface Props {
    open: boolean;
    slot: Slot | null;
    formValues: SlotFormValues;
    setFormValues: (val: SlotFormValues) => void;
    onClose: () => void;
    onSave: () => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
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
