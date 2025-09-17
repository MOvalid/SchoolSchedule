import React from 'react';
import { EntityType } from '../../types/enums/entityType';
import EntityPageBase from '../pages/EntityPageBase';

interface Props {
    entityType?: EntityType;
}

export const CreateEntityPageWrapper: React.FC<Props> = ({ entityType }) => (
    <EntityPageBase mode="create" entityType={entityType} />
);
