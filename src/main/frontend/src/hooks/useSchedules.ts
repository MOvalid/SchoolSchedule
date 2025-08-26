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
import { AxiosError } from 'axios';

export const useSchedules = () =>
    useQuery({
        queryKey: ['schedules'],
        queryFn: async () => (await getAllScheduleSlots()).data,
    });

// export const useCreateSchedule = (onError?: (message: string) => void) => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: ScheduleSlotDto) => createScheduleSlot(data),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] }),
//         onError: (error: any) => {
//             const message = error?.response?.data?.message || 'Unexpected error occurred';
//             if (onError) onError(message);
//         },
//     });
// };

export const useUpdateScheduleSlot = (
    entityType: EntityType,
    entityId: number,
    onError?: (_message: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ScheduleSlotDto }) =>
            updateScheduleSlot(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule', entityType, entityId] });
        },
        onError: (error: unknown) => {
            let message = 'Unexpected error occurred';
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            }
            if (onError) onError(message);
        },
    });
};

interface CreateStudentSlotProps {
    studentId: number;
    data: ScheduleSlotDto;
}

export const useCreateStudentScheduleSlot = (onError?: (_message: string) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ studentId, data }: CreateStudentSlotProps) =>
            createScheduleSlot(studentId, data),
        onSuccess: (_, { studentId }) => {
            queryClient.invalidateQueries({ queryKey: ['schedule', 'student', studentId] });
        },
        onError: (error: unknown) => {
            let message = 'Unexpected error occurred';
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            }
            if (onError) onError(message);
        },
    });
};

export const useDeleteScheduleSlot = (
    entityType: EntityType,
    entityId: number,
    onError?: (_message: string) => void
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteScheduleSlot(id),
        onSuccess: () => {
            if (entityType && entityId !== undefined) {
                queryClient.invalidateQueries({ queryKey: ['schedule', entityType, entityId] });
            } else {
                console.error('Invalid entityType or entityId for deleteScheduleSlot');
                queryClient.invalidateQueries({ queryKey: ['schedules'] });
            }
        },
        onError: (error: unknown) => {
            let message = 'Unexpected error occurred';
            if (error instanceof AxiosError) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            if (onError) onError(message);
        },
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
