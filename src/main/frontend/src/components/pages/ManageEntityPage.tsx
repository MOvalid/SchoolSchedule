import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { EntityTypes } from '../../types/enums/entityTypes';
import { StudentDto, TherapistDto, StudentClassDto } from '../../types/types';
import SearchSelect from '../common/SearchSelect';
import { getAllStudents } from '../../services/StudentService';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllClasses } from '../../services/StudentClassService';
import { CreateEntityPageWrapper } from '../wrappers/CreateEntityPageWrapper';
import { EditEntityPageWrapper } from '../wrappers/EditEntityPageWrapper';

interface EntityOption {
    id: number;
    label: string;
}

const ManageEntityPage: React.FC = () => {
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [entityType, setEntityType] = useState<EntityTypes | undefined>(undefined);
    const [selectedEntity, setSelectedEntity] = useState<
        StudentDto | TherapistDto | StudentClassDto | undefined
    >(undefined);
    const [options, setOptions] = useState<EntityOption[]>([]);

    useEffect(() => {
        if (!entityType || mode !== 'edit') {
            setOptions([]);
            setSelectedEntity(undefined);
            return;
        }

        const fetchEntities = async () => {
            try {
                switch (entityType) {
                    case EntityTypes.Student: {
                        const students = (await getAllStudents()).data as StudentDto[];
                        setOptions(
                            students.map((s) => ({
                                id: s.id!,
                                label: `${s.firstName} ${s.lastName}`,
                            }))
                        );
                        break;
                    }
                    case EntityTypes.Therapist: {
                        const therapists = (await getAllTherapists()).data as TherapistDto[];
                        setOptions(
                            therapists.map((t) => ({
                                id: t.id!,
                                label: `${t.firstName} ${t.lastName}`,
                            }))
                        );
                        break;
                    }
                    case EntityTypes.Class: {
                        const classes = (await getAllClasses()).data as StudentClassDto[];
                        setOptions(classes.map((c) => ({ id: c.id!, label: `Grupa ${c.name}` })));
                        break;
                    }
                }
            } catch (err) {
                console.error('Błąd pobierania encji:', err);
            }
        };

        fetchEntities();
    }, [entityType, mode]);

    // Pobranie wybranej encji w trybie edycji
    const handleSelectEntity = async (id: number | null) => {
        if (id === null) {
            setSelectedEntity(undefined);
            return;
        }

        try {
            switch (entityType) {
                case EntityTypes.Student: {
                    const student = (await getAllStudents()).data.find((s) => s.id === id);
                    setSelectedEntity(student || undefined);
                    break;
                }
                case EntityTypes.Therapist: {
                    const therapist = (await getAllTherapists()).data.find((t) => t.id === id);
                    setSelectedEntity(therapist || undefined);
                    break;
                }
                case EntityTypes.Class: {
                    const cls = (await getAllClasses()).data.find((c) => c.id === id);
                    setSelectedEntity(cls || undefined);
                    break;
                }
            }
        } catch (err) {
            console.error('Błąd pobierania szczegółów encji:', err);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Paper sx={{ p: 3, width: '100%', maxWidth: 600, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Zarządzanie encjami
                </Typography>

                {/* Wybór trybu */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                        variant={mode === 'create' ? 'contained' : 'outlined'}
                        onClick={() => {
                            setMode('create');
                            setSelectedEntity(undefined);
                        }}
                        fullWidth
                    >
                        Dodaj
                    </Button>
                    <Button
                        variant={mode === 'edit' ? 'contained' : 'outlined'}
                        onClick={() => setMode('edit')}
                        fullWidth
                    >
                        Edytuj
                    </Button>
                </Box>

                {/* Wybór typu encji */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

                {/* W trybie edycji wybór konkretnej encji */}
                {mode === 'edit' && entityType && (
                    <Box sx={{ mb: 2 }}>
                        <SearchSelect
                            label={
                                entityType === EntityTypes.Student
                                    ? 'Uczeń'
                                    : entityType === EntityTypes.Therapist
                                      ? 'Terapeuta'
                                      : 'Klasa'
                            }
                            items={options}
                            value={selectedEntity?.id || null}
                            onChange={(val) => handleSelectEntity(val as number | null)}
                            multiple={false}
                        />
                    </Box>
                )}
            </Paper>

            <Box sx={{ width: '100%', maxWidth: 600 }}>
                {mode === 'create' && <CreateEntityPageWrapper entityType={entityType} />}

                {mode === 'edit' && entityType && selectedEntity && (
                    <EditEntityPageWrapper entityType={entityType} entityData={selectedEntity} />
                )}
            </Box>
        </Box>
    );
};

export default ManageEntityPage;
