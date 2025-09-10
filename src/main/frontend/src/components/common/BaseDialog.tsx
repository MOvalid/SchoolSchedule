import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    SxProps,
    Theme,
} from '@mui/material';

interface BaseDialogProps {
    open: boolean;
    title: string;
    onClose: () => void;
    onSave?: () => void;
    saveLabel?: string;
    children: React.ReactNode;
}

const styles: Record<string, SxProps<Theme>> = {
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 1,
        maxHeight: '60vh',
        overflowY: 'auto',
    },
};
export const BaseDialog: React.FC<BaseDialogProps> = ({
    open,
    title,
    onClose,
    onSave,
    saveLabel = 'Zapisz',
    children,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={styles.dialogContent}>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anuluj</Button>
                {onSave && (
                    <Button onClick={onSave} variant="contained">
                        {saveLabel}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
