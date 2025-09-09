import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    FormControlLabel,
    Checkbox,
    Grid,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Slot, TherapistDto, RoomDto, StudentDto, StudentClassDto } from '../../types/types';
import { formatTimeRange, getValidityText } from '../../utils/DateUtils';
import {
    dialogTitleSx,
    titleTypographySx,
    closeButtonSx,
    rowGridSx,
    confirmDeleteStackSx,
} from '../../styles/slotDetails.styles';
import ConfirmDeleteActions from '../common/ConfirmDeleteActions';

interface SlotDetailsProps {
    open: boolean;
    slot: Slot | null;
    onClose: () => void;
    therapist?: TherapistDto | null;
    room?: RoomDto | null;
    studentClass?: StudentClassDto | null;
    students?: StudentDto[];
    onEdit?: (slot: Slot) => void;
    onDelete?: (slot: Slot, applyToAll: boolean) => void;
}

const SlotDetails: React.FC<SlotDetailsProps> = ({
    open,
    slot,
    therapist,
    room,
    studentClass,
    students,
    onClose,
    onEdit,
    onDelete,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [applyToAll, setApplyToAll] = useState(true);

    if (!slot) return null;

    const renderRow = (label: string, value: React.ReactNode) => (
        <Grid container spacing={1} sx={rowGridSx}>
            <Grid>
                <Typography variant="body1" fontWeight={600} color="text.secondary">
                    {label}
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="body1">{value}</Typography>
            </Grid>
        </Grid>
    );

    const studentNames = students?.length
        ? students.map((s) => `${s.firstName} ${s.lastName}`).join(', ')
        : '-';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={dialogTitleSx}>
                <Typography variant="h6" component="div" sx={titleTypographySx}>
                    Szczegóły zajęć
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={closeButtonSx}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    {renderRow('Nazwa zajęć:', slot.title || '-')}
                    {renderRow(
                        'Terapeuta:',
                        therapist ? `${therapist.firstName} ${therapist.lastName}` : '-'
                    )}
                    {renderRow('Sala:', room?.name || '-')}
                    {renderRow('Czas:', formatTimeRange(slot.start, slot.end))}
                    {renderRow('Klasa:', studentClass?.name || '-')}
                    {renderRow('Uczniowie:', studentNames)}
                    {renderRow(
                        'Data obowiązywania:',
                        getValidityText(slot.validFrom, slot.validTo)
                    )}
                </Stack>

                {confirmDelete && (
                    <Stack sx={confirmDeleteStackSx}>
                        <Typography color="error" fontWeight={600}>
                            Czy na pewno chcesz usunąć ten slot?
                        </Typography>
                        {students && students.length > 1 && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={applyToAll}
                                        onChange={(e) => setApplyToAll(e.target.checked)}
                                    />
                                }
                                label="Usuń dla wszystkich uczniów"
                            />
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions>
                {onEdit && !confirmDelete && (
                    <Button variant="contained" onClick={() => onEdit(slot)}>
                        Edytuj
                    </Button>
                )}

                <ConfirmDeleteActions
                    confirming={confirmDelete}
                    onConfirmDeleteChange={setConfirmDelete}
                    onDelete={() => onDelete?.(slot, applyToAll)}
                />

                {!confirmDelete && (
                    <Button variant="outlined" onClick={onClose}>
                        Powrót
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SlotDetails;
