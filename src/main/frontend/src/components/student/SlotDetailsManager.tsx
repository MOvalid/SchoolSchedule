import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import SlotDetails from './SlotDetails';
import SlotDialog from './SlotDialog';
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
    editSlot: (slot: Slot, formValues: SlotFormValues) => void;
    deleteSlot: (slot: Slot, applyToAll: boolean) => void;
    formValues: SlotFormValues | null;
    setFormValues: Dispatch<SetStateAction<SlotFormValues>>;
}

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
        });
        setEditOpen(true);
    };

    const handleDelete = (slot: Slot, applyToAll: boolean) => {
        deleteSlot(slot, applyToAll);
        setSelectedSlot(null);
    };

    const handleClose = () => {
        setEditOpen(false);
        setSelectedSlot(null);
    };

    const handleSave = () => {
        if (selectedSlot && formValues) editSlot(selectedSlot, formValues);
        setEditOpen(false);
        setSelectedSlot(null);
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
                    therapists={therapists}
                    rooms={rooms}
                    students={students}
                    classes={studentClasses}
                    entityType={entityType}
                    errorMessage={null}
                    saving={false}
                />
            )}
        </>
    );
};

export default SlotDetailsManager;
