import React from 'react';
import { Typography } from '@mui/material';

interface FormHeaderProps {
    mode: 'create' | 'edit';
    entityName: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ mode, entityName }) => {
    const text = mode === 'create' ? `Dodaj ${entityName}` : `Edytuj ${entityName}`;

    return (
        <Typography variant="h6" gutterBottom>
            {text}
        </Typography>
    );
};
