import React from 'react';
import { Box, Button } from '@mui/material';

interface FormSubmitButtonProps {
    mode: 'create' | 'edit';
    onClick: () => void;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ mode, onClick }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={onClick}>
                {mode === 'create' ? 'Zapisz' : 'Aktualizuj'}
            </Button>
        </Box>
    );
};
