import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { EntityTypes } from '../../types/enums/entityTypes';
import { StudentClassDto, StudentDto, TherapistDto } from '../../types/types';
import SearchSelect from '../common/SearchSelect';
import { getAllStudents } from '../../services/StudentService';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllClasses } from '../../services/StudentClassService';
import { CreateEntityPageWrapper } from '../wrappers/CreateEntityPageWrapper';
import { EditEntityPageWrapper } from '../wrappers/EditEntityPageWrapper';
import {
    pageContainer,
    paperContainer,
    modeButtonsBox,
    searchSelectBox,
    wrapperBox,
} from '../../styles/manageEntityPage.styles';
import { useNavigate } from 'react-router-dom';
import EntityTypeSelector from '../common/EntityTypeSelector';

interface EntityOption {
    id: number;
    label: string;
}

const ManageEntityPage: React.FC = () => {
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [entityType, setEntityType] = useState<EntityTypes>(EntityTypes.Student);
    const [selectedEntity, setSelectedEntity] = useState<
        StudentDto | TherapistDto | StudentClassDto | undefined
    >(undefined);
    const [options, setOptions] = useState<EntityOption[]>([]);

    const navigate = useNavigate();

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
        <Box sx={pageContainer}>
            <Paper sx={paperContainer}>
                <Typography variant="h6" gutterBottom>
                    Zarządzanie encjami
                </Typography>

                <Box sx={modeButtonsBox}>
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
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/import')}
                        fullWidth
                    >
                        Importuj dane
                    </Button>
                </Box>

                <EntityTypeSelector selected={entityType} onChange={setEntityType} />

                {mode === 'edit' && entityType && (
                    <Box sx={searchSelectBox}>
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

            <Box sx={wrapperBox}>
                {mode === 'create' && <CreateEntityPageWrapper entityType={entityType} />}
                {mode === 'edit' && entityType && selectedEntity && (
                    <EditEntityPageWrapper entityType={entityType} entityData={selectedEntity} />
                )}
            </Box>
        </Box>
    );
};

export default ManageEntityPage;
