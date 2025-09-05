import React from 'react';
import { Box, Button, SxProps, Theme } from '@mui/material';
import { EntityTypes } from '../../types/enums/entityTypes';

interface Props {
    selected: EntityTypes;
    onChange: (type: EntityTypes) => void;
    sx?: SxProps<Theme>;
}

const EntityTypeSelector: React.FC<Props> = ({ selected, onChange, sx }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, ...sx }}>
            <Button
                variant={selected === EntityTypes.Student ? 'contained' : 'outlined'}
                onClick={() => onChange(EntityTypes.Student)}
                fullWidth
            >
                Uczeń
            </Button>
            <Button
                variant={selected === EntityTypes.Therapist ? 'contained' : 'outlined'}
                onClick={() => onChange(EntityTypes.Therapist)}
                fullWidth
            >
                Terapeuta
            </Button>
            <Button
                variant={selected === EntityTypes.Class ? 'contained' : 'outlined'}
                onClick={() => onChange(EntityTypes.Class)}
                fullWidth
            >
                Klasa
            </Button>
        </Box>
    );
};

export default EntityTypeSelector;
