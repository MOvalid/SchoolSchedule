import React from 'react';
import { BaseDialog } from './BaseDialog';
import { AvailabilityDto, CreateAvailabilityDto } from '../../types/types';
import { AvailabilityForm } from '../forms/AvailabilityForm';

interface AvailabilityDialogProps {
    open: boolean;
    editingAvailability: AvailabilityDto | null;
    formValues: CreateAvailabilityDto;
    onChange: (values: CreateAvailabilityDto) => void;
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
