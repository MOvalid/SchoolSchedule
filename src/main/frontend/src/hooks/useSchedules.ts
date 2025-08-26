import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllScheduleSlots,
    createScheduleSlot,
    updateScheduleSlot,
    deleteScheduleSlot,
    getScheduleForStudent,
    getScheduleForTherapist,
    getScheduleForClass,
    updateStudentScheduleSlot,
    deleteStudentScheduleSlot,
} from '../services/ScheduleService';
import { ScheduleSlotDto } from '../types/types';
import { EntityType, EntityTypesEnum } from '../types/entityTypes';
import { AxiosError } from 'axios';

type OnErrorFn = (message: string) => void;

export const useSchedules = () =>
    useQuery({ queryKey: ['schedules'], queryFn: async () => (await getAllScheduleSlots()).data });

export const useSchedule = (entityType: EntityType, entityId: number) =>
    useQuery<ScheduleSlotDto[], Error>({
        queryKey: ['schedule', entityType, entityId],
        queryFn: async () => {
            switch (entityType) {
                case 'student': {
                    const res = await getScheduleForStudent(entityId);
                    return res.data;
                }
                case 'therapist': {
                    const res = await getScheduleForTherapist(entityId);
                    return res.data;
                }
                case 'class': {
                    const res = await getScheduleForClass(entityId);
                    return res.data;
                }
                default: {
                    return Promise.resolve([]);
                }
            }
        },
        enabled: !!entityId && !!entityType,
    });

function useScheduleSlotMutation<TVariables, TResult = unknown>(
    mutationFn: (variables: TVariables) => Promise<TResult>,
    entityType: EntityType,
    entityId: number,
    onError?: OnErrorFn,
    invalidateQueries: string[] = ['schedule']
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...invalidateQueries, entityType, entityId],
            });
        },
        onError: (error: unknown) => {
            let msg = 'Unexpected error occurred';
            if (error instanceof AxiosError) msg = error.response?.data?.message || msg;
            else if (error instanceof Error) msg = error.message;
            if (onError) onError(msg);
        },
    });
}

// CREATE
interface CreateStudentSlotProps {
    studentId: number;
    data: ScheduleSlotDto;
}
export const useCreateStudentScheduleSlot = (onError?: OnErrorFn) =>
    useScheduleSlotMutation<CreateStudentSlotProps>(
        ({ studentId, data }) => createScheduleSlot(studentId, data),
        EntityTypesEnum.Student,
        0,
        onError
    );

// UPDATE
interface UpdateStudentSlotProps {
    id: number;
    studentId: number;
    data: ScheduleSlotDto;
}

export const useUpdateScheduleSlotForAll = (
    entityType: EntityType,
    entityId: number,
    onError?: OnErrorFn
) =>
    useScheduleSlotMutation<{ id: number; data: ScheduleSlotDto }>(
        ({ id, data }) => updateScheduleSlot(id, data),
        entityType,
        entityId,
        onError
    );

export const useUpdateScheduleSlotForStudent = (
    entityType: EntityType,
    entityId: number,
    onError?: OnErrorFn
) =>
    useScheduleSlotMutation<UpdateStudentSlotProps>(
        ({ id, studentId, data }) => updateStudentScheduleSlot(studentId, id, data),
        entityType,
        entityId,
        onError
    );

// DELETE
interface DeleteStudentSlotProps {
    id: number;
    studentId: number;
}
export const useDeleteScheduleSlotForAll = (
    entityType: EntityType,
    entityId: number,
    onError?: OnErrorFn
) =>
    useScheduleSlotMutation<{ id: number }>(
        ({ id }) => deleteScheduleSlot(id),
        entityType,
        entityId,
        onError
    );

export const useDeleteScheduleSlotForStudent = (
    entityType: EntityType,
    entityId: number,
    onError?: OnErrorFn
) =>
    useScheduleSlotMutation<DeleteStudentSlotProps>(
        ({ id, studentId }) => deleteStudentScheduleSlot(studentId, id),
        entityType,
        entityId,
        onError
    );
