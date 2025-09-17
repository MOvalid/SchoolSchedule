import React from 'react';
import { EntityType } from '../../types/enums/entityType';
import { StudentDto, TherapistDto, StudentClassDto } from '../../types/types';
import EntityPageBase from '../pages/EntityPageBase';

interface Props {
    entityType: EntityType;
    entityData: StudentDto | TherapistDto | StudentClassDto;
}

export const EditEntityPageWrapper: React.FC<Props> = ({ entityType, entityData }) => (
    <EntityPageBase mode="edit" entityType={entityType} entityData={entityData} />
);
