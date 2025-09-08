import React from 'react';
import { Button, Stack } from '@mui/material';

interface ConfirmDeleteActionsProps {
    confirming: boolean;
    onConfirmDeleteChange: (confirming: boolean) => void;
    onDelete: () => void;
}

const ConfirmDeleteActions: React.FC<ConfirmDeleteActionsProps> = ({
    confirming,
    onConfirmDeleteChange,
    onDelete,
}) => {
    return (
        <Stack direction="row" spacing={2}>
            {confirming ? (
                <>
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Usuń
                    </Button>
                    <Button variant="outlined" onClick={() => onConfirmDeleteChange(false)}>
                        Anuluj
                    </Button>
                </>
            ) : (
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => onConfirmDeleteChange(true)}
                >
                    Usuń
                </Button>
            )}
        </Stack>
    );
};

export default ConfirmDeleteActions;
