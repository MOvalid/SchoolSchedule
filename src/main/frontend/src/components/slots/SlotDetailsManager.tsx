import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import axios from 'axios';
import SlotDetails from './SlotDetails';
import { SlotDialog } from './SlotDialog';
import {
    Slot,
    SlotFormValues,
    TherapistDto,
    RoomDto,
    StudentDto,
    StudentClassDto,
} from '../../types/types';
import { EntityTypes } from '../../types/enums/entityTypes';

interface SlotDetailsManagerProps {
    selectedSlot: Slot | null;
    setSelectedSlot: (slot: Slot | null) => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    students: StudentDto[];
    studentClasses: StudentClassDto[];
    entityType: EntityTypes;
    studentId: number;
    editSlot: (
        slot: Slot,
        formValues: SlotFormValues,
        options?: { onSuccess?: () => void; onError?: (error: unknown) => void }
    ) => void;
    deleteSlot: (slot: Slot, applyToAll: boolean) => void;
    formValues: SlotFormValues | null;
    setFormValues: Dispatch<SetStateAction<SlotFormValues>>;
}

const mapBackendErrorsToFormFields = (errors: Record<string, string>): Record<string, string> => {
    const mapping: Record<string, keyof SlotFormValues> = {
        therapist: 'therapistId',
        room: 'roomId',
        studentClass: 'studentClassId',
        students: 'studentIds',
        title: 'title',
        start: 'start',
        end: 'end',
        validFrom: 'validFrom',
        validTo: 'validTo',
    };
    const result: Record<string, string> = {};
    for (const key in errors) {
        const mappedKey = mapping[key] ?? key;
        result[mappedKey] = errors[key];
    }
    return result;
};

const SlotDetailsManager: React.FC<SlotDetailsManagerProps> = ({
    selectedSlot,
    setSelectedSlot,
    therapists,
    rooms,
    students,
    studentClasses,
    entityType,
    studentId,
    editSlot,
    deleteSlot,
    formValues,
    setFormValues,
}) => {
    const [editOpen, setEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const openHandler = () => setEditOpen(true);
        document.addEventListener('openSlotDialog', openHandler);
        return () => document.removeEventListener('openSlotDialog', openHandler);
    }, []);

    const handleEdit = (slot: Slot) => {
        setFormValues({
            title: slot.title || '',
            start: slot.start,
            end: slot.end,
            therapistId: slot.therapistId,
            roomId: slot.roomId,
            studentIds: slot.studentIds ?? [studentId],
            studentClassId: slot.studentClassId,
            applyToAll: true,
            validFrom: slot.validFrom ?? '',
            validTo: slot.validTo ?? '',
        });
        setFieldErrors({});
        setEditOpen(true);
    };

    const handleDelete = (slot: Slot, applyToAll: boolean) => {
        deleteSlot(slot, applyToAll);
        setSelectedSlot(null);
    };

    const handleClose = () => {
        setEditOpen(false);
        setSelectedSlot(null);
        setFieldErrors({});
    };

    const handleError = (err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.data?.errors) {
            setFieldErrors(mapBackendErrorsToFormFields(err.response.data.errors));
        } else if (axios.isAxiosError(err) && err.response?.data?.message) {
            setFieldErrors({ general: err.response.data.message });
        } else if (err instanceof Error) {
            setFieldErrors({ general: err.message });
        } else {
            setFieldErrors({ general: 'Nieznany błąd' });
        }
    };

    const handleSave = async () => {
        if (selectedSlot && formValues) {
            setSaving(true);
            editSlot(selectedSlot, formValues, {
                onSuccess: () => {
                    handleClose();
                    setSaving(false);
                },
                onError: (err: unknown) => {
                    console.error('Error saving slot:', err);
                    handleError(err);
                    setSaving(false);
                },
            });
        }
    };

    const selectedTherapist = selectedSlot?.therapistId
        ? therapists.find((t) => t.id === selectedSlot.therapistId) || null
        : null;
    const selectedRoom = selectedSlot?.roomId
        ? rooms.find((r) => r.id === selectedSlot.roomId) || null
        : null;
    const selectedClass = selectedSlot?.studentClassId
        ? studentClasses.find((c) => c.id === selectedSlot.studentClassId) || null
        : null;
    const selectedStudents = selectedSlot?.studentIds
        ? (selectedSlot.studentIds
              .map((id) => students.find((s) => s.id === id))
              .filter(Boolean) as StudentDto[])
        : [];

    return (
        <>
            {selectedSlot && !editOpen && (
                <SlotDetails
                    open={true}
                    slot={selectedSlot}
                    therapist={selectedTherapist}
                    room={selectedRoom}
                    studentClass={selectedClass}
                    students={selectedStudents}
                    onClose={handleClose}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {editOpen && selectedSlot && formValues && (
                <SlotDialog
                    open={editOpen}
                    slot={selectedSlot}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    onClose={handleClose}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    therapists={therapists}
                    rooms={rooms}
                    students={students}
                    classes={studentClasses}
                    entityType={entityType}
                    saving={saving}
                    fieldErrors={fieldErrors}
                    setFieldErrors={setFieldErrors}
                />
            )}
        </>
    );
};

export default SlotDetailsManager;
