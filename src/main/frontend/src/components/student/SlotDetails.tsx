import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
} from '@mui/material';
import { Slot, TherapistDto, RoomDto } from '../../types/types';

interface SlotDetailsProps {
    open: boolean;
    slot: Slot | null;
    onClose: () => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    onEdit?: (slot: Slot) => void;
    onDelete?: (slot: Slot) => void;
}

const SlotDetails: React.FC<SlotDetailsProps> = ({
    open,
    slot,
    onClose,
    therapists,
    rooms,
    onEdit,
    onDelete,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!slot) return null;

    const therapist = slot.therapistId ? therapists.find((t) => t.id === slot.therapistId) : null;
    const room = slot.roomId ? rooms.find((r) => r.id === slot.roomId) : null;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Szczegóły zajęć</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={1}>
                    <Typography>
                        <strong>Nazwa zajęć:</strong> {slot.title || '-'}
                    </Typography>
                    <Typography>
                        <strong>Terapeuta:</strong>{' '}
                        {therapist ? `${therapist.firstName} ${therapist.lastName}` : '-'}
                    </Typography>
                    <Typography>
                        <strong>Sala:</strong> {room?.name || '-'}
                    </Typography>
                    <Typography>
                        <strong>Start:</strong> {slot.start}
                    </Typography>
                    <Typography>
                        <strong>Koniec:</strong> {slot.end}
                    </Typography>
                    <Typography>
                        <strong>Uczniowie:</strong> {slot.studentIds?.join(', ') || '-'}
                    </Typography>
                    <Typography>
                        <strong>Klasa:</strong> {slot.studentClassId || '-'}
                    </Typography>
                </Stack>
                {confirmDelete && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        Czy na pewno chcesz usunąć ten slot?
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                {onEdit && <Button onClick={() => onEdit(slot)}>Edytuj</Button>}
                {onDelete &&
                    (!confirmDelete ? (
                        <Button color="error" onClick={() => setConfirmDelete(true)}>
                            Usuń
                        </Button>
                    ) : (
                        <>
                            <Button color="error" onClick={() => onDelete(slot)}>
                                Potwierdź
                            </Button>
                            <Button onClick={() => setConfirmDelete(false)}>Anuluj</Button>
                        </>
                    ))}
                <Button onClick={onClose}>Zamknij</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SlotDetails;
