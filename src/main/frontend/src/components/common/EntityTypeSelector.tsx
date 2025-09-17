import React from 'react';
import ToggleButtonGroupBox from '../common/ToggleButtonGroupBox';
import { EntityType } from '../../types/enums/entityType';

interface Props {
    selected: EntityType;
    onChange: (type: EntityType) => void;
}

const EntityTypeSelector: React.FC<Props> = ({ selected, onChange }) => {
    return (
        <ToggleButtonGroupBox
            selected={selected}
            onChange={onChange}
            options={[
                { value: EntityType.Student, label: 'Uczeń' },
                { value: EntityType.Therapist, label: 'Terapeuta' },
                { value: EntityType.Class, label: 'Klasa' },
            ]}
        />
    );
};

export default EntityTypeSelector;
