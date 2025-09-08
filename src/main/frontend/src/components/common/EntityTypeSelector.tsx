import React from 'react';
import ToggleButtonGroupBox from '../common/ToggleButtonGroupBox';
import { EntityTypes } from '../../types/enums/entityTypes';

interface Props {
    selected: EntityTypes;
    onChange: (type: EntityTypes) => void;
}

const EntityTypeSelector: React.FC<Props> = ({ selected, onChange }) => {
    return (
        <ToggleButtonGroupBox
            selected={selected}
            onChange={onChange}
            options={[
                { value: EntityTypes.Student, label: 'Uczeń' },
                { value: EntityTypes.Therapist, label: 'Terapeuta' },
                { value: EntityTypes.Class, label: 'Klasa' },
            ]}
        />
    );
};

export default EntityTypeSelector;
