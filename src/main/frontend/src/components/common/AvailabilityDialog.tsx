import React from 'react';
import { BaseDialog } from './BaseDialog';
import { TherapistAvailabilityDto, CreateTherapistAvailabilityDto } from '../../types/types';
import { AvailabilityForm } from '../forms/AvailabilityForm';

interface AvailabilityDialogProps {
    open: boolean;
    editingAvailability: TherapistAvailabilityDto | null;
    formValues: CreateTherapistAvailabilityDto;
    onChange: (values: CreateTherapistAvailabilityDto) => void;
    onClose: () => void;
    onSave: () => void;
}

export const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
    open,
    editingAvailability,
    formValues,
    onChange,
    onClose,
    onSave,
}) => {
    const title = editingAvailability ? 'Edytuj dostępność' : 'Dodaj dostępność';

    return (
        <BaseDialog open={open} title={title} onClose={onClose} onSave={onSave}>
            <AvailabilityForm values={formValues} onChange={onChange} />
        </BaseDialog>
    );
};
