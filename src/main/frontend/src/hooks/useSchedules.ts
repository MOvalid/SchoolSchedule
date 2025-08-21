import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllScheduleSlots,
    createScheduleSlot,
    updateScheduleSlot,
    deleteScheduleSlot,
    getScheduleForStudent,
    getScheduleForTherapist,
    getScheduleForClass,
} from '../services/ScheduleService';
import { ScheduleSlotDto } from '../types/types';
import { EntityType } from '../types/entityTypes';

export const useSchedules = () =>
    useQuery({
        queryKey: ['schedules'],
        queryFn: async () => (await getAllScheduleSlots()).data,
    });

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ScheduleSlotDto) => createScheduleSlot(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] }),
    });
};

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ScheduleSlotDto }) =>
            updateScheduleSlot(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] }),
    });
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteScheduleSlot(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] }),
    });
};

/**
 * Hook do pobierania grafiku dla podanego typu bytu i jego ID.
 * @param entityType Typ bytu ('student', 'therapist', 'class')
 * @param entityId ID bytu
 * @returns obiekt react-query z danymi i statusami
 */
export const useSchedule = (entityType: EntityType, entityId: number) => {
    return useQuery<ScheduleSlotDto[], Error>({
        queryKey: ['schedule', entityType, entityId],
        queryFn: () => {
            switch (entityType) {
                case 'student':
                    return getScheduleForStudent(entityId).then((res) => res.data);
                case 'therapist':
                    return getScheduleForTherapist(entityId).then((res) => res.data);
                case 'class':
                    return getScheduleForClass(entityId).then((res) => res.data);
                default:
                    return Promise.resolve([]);
            }
        },
        enabled: !!entityId && !!entityType,
    });
};
