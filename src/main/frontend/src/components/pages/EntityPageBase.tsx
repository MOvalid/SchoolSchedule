import React from 'react';
import { Box, Typography } from '@mui/material';
import { EntityType } from '../../types/enums/entityType';
import { StudentForm } from '../forms/StudentForm';
import TherapistForm from '../forms/TherapistForm';
import ClassForm from '../forms/ClassForm';
import { StudentClassDto, StudentDto, TherapistDto } from '../../types/types';

type Mode = 'create' | 'edit';

interface Props {
    mode: Mode;
    entityType?: EntityType;
    entityData?: StudentDto | TherapistDto | StudentClassDto;
}

const EntityPageBase: React.FC<Props> = ({ mode, entityType, entityData }) => {
    const renderForm = () => {
        switch (entityType) {
            case EntityType.Student:
                return <StudentForm initialData={entityData as StudentDto} mode={mode} />;
            case EntityType.Therapist:
                return <TherapistForm initialData={entityData as TherapistDto} mode={mode} />;
            case EntityType.Class:
                return <ClassForm initialData={entityData as StudentClassDto} mode={mode} />;
            default:
                return null;
        }
    };

    return (
        <Box>{renderForm() || <Typography variant="body2">Wybierz rodzaj obiektu</Typography>}</Box>
    );
};

export default EntityPageBase;
