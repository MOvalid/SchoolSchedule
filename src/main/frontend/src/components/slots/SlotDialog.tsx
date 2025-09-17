import React, { useState } from 'react';
import {
    RoomDto,
    Slot,
    SlotFormValues,
    StudentClassDto,
    StudentDto,
    TherapistDto,
} from '../../types/types';
import { BaseDialog } from '../common/BaseDialog';
import { SlotForm } from '../forms/SlotForm';
import ConfirmDeleteActions from '../common/ConfirmDeleteActions';
import { EntityType } from '../../types/enums/entityType';

interface Props {
    open: boolean;
    slot: Slot | null;
    formValues: SlotFormValues;
    setFormValues: (val: SlotFormValues) => void;
    onClose: () => void;
    onSave: () => Promise<void>;
    onDelete: (slot: Slot, applyToAll: boolean) => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    students: StudentDto[];
    classes: StudentClassDto[];
    entityType: EntityType;
    saving?: boolean;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const SlotDialog: React.FC<Props> = ({
    open,
    slot,
    formValues,
    setFormValues,
    onClose,
    onSave,
    onDelete,
    therapists,
    rooms,
    students,
    classes,
    entityType,
    fieldErrors,
    setFieldErrors,
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!slot) return null;

    const handleDeleteClick = () => onDelete(slot, formValues.applyToAll);

    const title = slot.slotId ? 'Edycja zajęć' : 'Dodawanie zajęć';

    return (
        <BaseDialog
            open={open}
            title={title}
            onClose={onClose}
            onSave={!confirmDelete ? onSave : undefined}
            saveLabel="Zapisz"
        >
            <SlotForm
                formValues={formValues}
                setFormValues={setFormValues}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                therapists={therapists}
                rooms={rooms}
                students={students}
                classes={classes}
                entityType={entityType}
                showConfirmDelete={confirmDelete}
            />

            {slot.slotId && (
                <ConfirmDeleteActions
                    confirming={confirmDelete}
                    onConfirmDeleteChange={setConfirmDelete}
                    onDelete={handleDeleteClick}
                />
            )}
        </BaseDialog>
    );
};
