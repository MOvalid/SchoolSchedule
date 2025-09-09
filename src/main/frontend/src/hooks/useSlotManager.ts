import { useState } from 'react';
import { Slot, SlotFormValues } from '../types/types';
import {
    useCreateScheduleSlot,
    useUpdateScheduleSlotForAll,
    useUpdateScheduleSlotForEntity,
    useDeleteScheduleSlotForAll,
    useDeleteScheduleSlotForEntity,
    useClearSchedule,
} from './useSchedules';
import { convertFormValuesToScheduleSlotDto } from '../utils/ScheduleSlotConverter';
import { EntityTypes } from '../types/enums/entityTypes';

export const useSlotManager = (entityType: EntityTypes, entityId: number) => {
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [formValues, setFormValues] = useState<SlotFormValues>({
        title: '',
        start: '',
        end: '',
        therapistId: undefined,
        roomId: undefined,
        studentIds: [],
        studentClassId: undefined,
        applyToAll: true,
        validFrom: '',
        validTo: '',
    });

    const createSlot = useCreateScheduleSlot(entityType, entityId);
    const updateSlotForAll = useUpdateScheduleSlotForAll(entityType, entityId);
    const updateSlotForEntity = useUpdateScheduleSlotForEntity(entityType, entityId);
    const deleteSlotForAll = useDeleteScheduleSlotForAll(entityType, entityId);
    const deleteSlotForEntity = useDeleteScheduleSlotForEntity(entityType, entityId);
    const clearSchedule = useClearSchedule(entityType, entityId);

    const handleSlotSave = (
        slot: Slot,
        values: SlotFormValues,
        options?: { onSuccess?: () => void; onError?: (error: unknown) => void }
    ) => {
        const dto = convertFormValuesToScheduleSlotDto(values);

        if (slot.slotId) {
            if (values.applyToAll) {
                updateSlotForAll.mutate({ id: slot.slotId, data: dto }, options);
            } else {
                updateSlotForEntity.mutate({ id: slot.slotId, entityId, data: dto }, options);
            }
        } else {
            createSlot.mutate({ entityId, data: dto }, options);
        }
    };

    const handleDeleteSlot = (slot: Slot, applyToAll: boolean) => {
        if (!slot.slotId) return;
        if (applyToAll) deleteSlotForAll.mutate({ id: slot.slotId });
        else deleteSlotForEntity.mutate({ id: slot.slotId, entityId });
    };

    const handleClearSchedule = () => clearSchedule.mutate({ id: entityId, entityType });

    return {
        selectedSlot,
        setSelectedSlot,
        formValues,
        setFormValues,
        handleSlotSave,
        handleDeleteSlot,
        handleClearSchedule,
    };
};
