import React from 'react';
import { EntityTypes } from '../../types/enums/entityTypes';
import { StudentDto, TherapistDto, StudentClassDto } from '../../types/types';
import EntityPageBase from '../pages/EntityPageBase';

interface Props {
    entityType: EntityTypes;
    entityData: StudentDto | TherapistDto | StudentClassDto;
}

export const EditEntityPageWrapper: React.FC<Props> = ({ entityType, entityData }) => (
    <EntityPageBase mode="edit" entityType={entityType} entityData={entityData} />
);
