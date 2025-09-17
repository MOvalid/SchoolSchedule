import React from 'react';
import { useParams } from 'react-router-dom';
import { EntityType } from '../../types/enums/entityType';
import { ManageAvailabilityPage } from '../pages/ManageAvailabilityPage';

export const ManageAvailabilityPageWrapper: React.FC = () => {
    const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();

    if (!entityType || !entityId) return null;

    const parsedEntityType =
        entityType.toUpperCase() === 'THERAPIST' ? EntityType.Therapist : EntityType.Student;

    const parsedEntityId = Number(entityId);

    return <ManageAvailabilityPage entityType={parsedEntityType} entityId={parsedEntityId} />;
};
