import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import SlotDetails from './SlotDetails';
import SlotDialog from './SlotDialog';
import { Slot, SlotFormValues, TherapistDto, RoomDto } from '../../types/types';

interface SlotDetailsManagerProps {
    selectedSlot: Slot | null;
    setSelectedSlot: (slot: Slot | null) => void;
    therapists: TherapistDto[];
    rooms: RoomDto[];
    studentId: number;
    editSlot: (slot: Slot, formValues: SlotFormValues) => void;
    deleteSlot: (slotId: number, onSuccess: () => void) => void;
    formValues: SlotFormValues | null;
    setFormValues: Dispatch<SetStateAction<SlotFormValues>>;
}

const SlotDetailsManager: React.FC<SlotDetailsManagerProps> = ({
    selectedSlot,
    setSelectedSlot,
    therapists,
    rooms,
    studentId,
    editSlot,
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
        });
        setEditOpen(true);
    };

    return (
        <>
            {selectedSlot && !editOpen && (
                <SlotDetails
                    open={true}
                    slot={selectedSlot}
                    therapists={therapists}
                    rooms={rooms}
                    onClose={() => setSelectedSlot(null)}
                    onEdit={handleEdit}
                    onDelete={() => setSelectedSlot(null)}
                />
            )}

            {editOpen && selectedSlot && formValues && (
                <SlotDialog
                    open={editOpen}
                    slot={selectedSlot}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    onClose={() => {
                        setEditOpen(false);
                        setSelectedSlot(null);
                    }}
                    onSave={() => {
                        editSlot(selectedSlot, formValues);
                        setEditOpen(false);
                        setSelectedSlot(null);
                    }}
                    therapists={therapists}
                    rooms={rooms}
                    errorMessage={null}
                    saving={false}
                />
            )}
        </>
    );
};

export default SlotDetailsManager;
