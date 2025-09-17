import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { EntityType } from '../../types/enums/entityType';
import { StudentClassDto, StudentDto, TherapistDto } from '../../types/types';
import SearchSelect from '../common/SearchSelect';
import { getAllStudents } from '../../services/StudentService';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllClasses } from '../../services/StudentClassService';
import { CreateEntityPageWrapper } from '../wrappers/CreateEntityPageWrapper';
import { EditEntityPageWrapper } from '../wrappers/EditEntityPageWrapper';
import {
    actionGroupsContainer,
    pageContainer,
    paperContainer,
    searchSelectBox,
    wrapperBox,
} from '../../styles/manageEntityPage.styles';
import { useNavigate } from 'react-router-dom';
import EntityTypeSelector from '../common/EntityTypeSelector';
import ToggleButtonGroupBox from '../common/ToggleButtonGroupBox';

interface EntityOption {
    id: number;
    label: string;
}

export enum Mode {
    Create = 'create',
    Edit = 'edit',
    Import = 'import',
}

const ManageEntityPage: React.FC = () => {
    const [mode, setMode] = useState<Mode>(Mode.Create);
    const [entityType, setEntityType] = useState<EntityType>(EntityType.Student);
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
                    case EntityType.Student: {
                        const students = (await getAllStudents()).data as StudentDto[];
                        setOptions(
                            students.map((s) => ({
                                id: s.id!,
                                label: `${s.firstName} ${s.lastName}`,
                            }))
                        );
                        break;
                    }
                    case EntityType.Therapist: {
                        const therapists = (await getAllTherapists()).data as TherapistDto[];
                        setOptions(
                            therapists.map((t) => ({
                                id: t.id!,
                                label: `${t.firstName} ${t.lastName}`,
                            }))
                        );
                        break;
                    }
                    case EntityType.Class: {
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

    useEffect(() => {
        setSelectedEntity(undefined);
    }, [entityType]);

    const handleSelectEntity = async (id: number | null) => {
        if (id === null) {
            setSelectedEntity(undefined);
            return;
        }

        try {
            switch (entityType) {
                case EntityType.Student: {
                    const student = (await getAllStudents()).data.find((s) => s.id === id);
                    setSelectedEntity(student || undefined);
                    break;
                }
                case EntityType.Therapist: {
                    const therapist = (await getAllTherapists()).data.find((t) => t.id === id);
                    setSelectedEntity(therapist || undefined);
                    break;
                }
                case EntityType.Class: {
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

                <Box sx={actionGroupsContainer}>
                    <ToggleButtonGroupBox<Mode>
                        selected={mode}
                        onChange={(val) => {
                            setMode(val);
                            if (val === Mode.Create) {
                                setSelectedEntity(undefined);
                            } else if (val === Mode.Import) {
                                navigate('/import');
                            }
                        }}
                        options={[
                            { value: Mode.Create, label: 'Dodaj' },
                            { value: Mode.Edit, label: 'Edytuj' },
                            { value: Mode.Import, label: 'Importuj dane', color: 'secondary' },
                        ]}
                    />

                    <EntityTypeSelector selected={entityType} onChange={setEntityType} />
                </Box>

                {mode === 'edit' && entityType && (
                    <Box sx={searchSelectBox}>
                        <SearchSelect
                            label={
                                entityType === EntityType.Student
                                    ? 'Uczeń'
                                    : entityType === EntityType.Therapist
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
