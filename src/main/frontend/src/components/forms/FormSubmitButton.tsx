import React from 'react';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BaseButton from '../common/BaseButton';

interface FormSubmitButtonProps {
    mode: 'create' | 'edit';
    onClick: () => void;
    isLoading?: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
    mode,
    onClick,
    isLoading = false,
}) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <BaseButton
                isLoading={isLoading}
                onClick={onClick}
                color="primary"
                startIcon={<CheckIcon />}
                loadingText={mode === 'create' ? 'Zapisywanie...' : 'Aktualizowanie...'}
            >
                {mode === 'create' ? 'Zapisz' : 'Aktualizuj'}
            </BaseButton>
        </Box>
    );
};
