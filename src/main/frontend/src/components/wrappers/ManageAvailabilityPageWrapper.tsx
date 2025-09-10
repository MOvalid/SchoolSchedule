import React from 'react';
import { useParams } from 'react-router-dom';
import { EntityTypes } from '../../types/enums/entityTypes';
import { ManageAvailabilityPage } from '../pages/ManageAvailabilityPage';

export const ManageAvailabilityPageWrapper: React.FC = () => {
    const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();

    if (!entityType || !entityId) return null;
    console.log(entityType, entityId);
    const parsedEntityType =
        entityType.toUpperCase() === 'THERAPIST' ? EntityTypes.Therapist : EntityTypes.Student;

    const parsedEntityId = Number(entityId);

    return <ManageAvailabilityPage entityType={parsedEntityType} entityId={parsedEntityId} />;
};
