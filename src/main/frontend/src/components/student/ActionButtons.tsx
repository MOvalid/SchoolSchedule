import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface Props {
    editMode: boolean;
    setEditMode: (val: boolean) => void;
}

const ActionButtons: React.FC<Props> = ({ editMode, setEditMode }) => {
    const navigate = useNavigate();
    return (
        <Stack direction="row" spacing={2} mb={2}>
            <Button variant="contained" color="primary" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Zakończ edycję' : 'Edytuj'}
            </Button>
            <Button variant="contained" color="error">
                Wyczyść
            </Button>
            <Button variant="contained" color="secondary" onClick={() => window.print()}>
                Drukuj
            </Button>
            <Button variant="outlined" color="info" onClick={() => navigate(-1)}>
                Powrót
            </Button>
        </Stack>
    );
};

export default ActionButtons;
