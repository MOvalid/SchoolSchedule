import React from 'react';
import { EntityTypes } from '../../types/enums/entityTypes';
import EntityPageBase from '../pages/EntityPageBase';

interface Props {
    entityType?: EntityTypes;
}

export const CreateEntityPageWrapper: React.FC<Props> = ({ entityType }) => (
    <EntityPageBase mode="create" entityType={entityType} />
);
