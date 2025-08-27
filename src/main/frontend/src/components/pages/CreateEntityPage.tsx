import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { EntityTypes } from '../../types/enums/entityTypes';
import { StudentForm } from '../forms/StudentForm';
import TherapistForm from '../forms/TherapistForm';
import ClassForm from '../forms/ClassForm';

const CreateEntityPage: React.FC = () => {
    const [entityType, setEntityType] = useState<EntityTypes | null>(null);

    const renderForm = () => {
        switch (entityType) {
            case EntityTypes.Student:
                return <StudentForm />;
            case EntityTypes.Therapist:
                return <TherapistForm />;
            case EntityTypes.Class:
                return <ClassForm />;
            default:
                return (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Wybierz typ elementu powyżej
                    </Typography>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
                <Typography variant="h6" gutterBottom>
                    Dodaj nowy element
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant={entityType === EntityTypes.Student ? 'contained' : 'outlined'}
                        onClick={() => setEntityType(EntityTypes.Student)}
                        fullWidth
                    >
                        Uczeń
                    </Button>
                    <Button
                        variant={entityType === EntityTypes.Therapist ? 'contained' : 'outlined'}
                        onClick={() => setEntityType(EntityTypes.Therapist)}
                        fullWidth
                    >
                        Terapeuta
                    </Button>
                    <Button
                        variant={entityType === EntityTypes.Class ? 'contained' : 'outlined'}
                        onClick={() => setEntityType(EntityTypes.Class)}
                        fullWidth
                    >
                        Klasa
                    </Button>
                </Box>

                {renderForm()}
            </Paper>
        </Box>
    );
};

export default CreateEntityPage;
