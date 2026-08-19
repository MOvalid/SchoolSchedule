import { useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createScheduleSlot,
    deleteSchedule,
    deleteScheduleSlot,
    deleteStudentScheduleSlot,
    getAllScheduleSlots,
    getScheduleForClass,
    getScheduleForStudent,
    getScheduleForTherapist,
    updateScheduleSlot,
    updateStudentScheduleSlot,
} from '../services/ScheduleService';
import { ScheduleSlotDto, Slot } from '../types/types';
import { EntityType } from '../types/enums/entityType';
import { AxiosError } from 'axios';
import { useSnackbar } from '../context/SnackbarContext';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { convertScheduleSlotDto } from '../utils/ScheduleSlotConverter';

export const useSchedules = () =>
    useQuery({
        queryKey: ['schedules'],
        queryFn: async () => (await getAllScheduleSlots()).data,
    });

export const useSchedule = (entityType: EntityType, entityId: number, date?: string) =>
    useQuery<ScheduleSlotDto[], Error>({
        queryKey: ['schedule', entityType, entityId, date],
        queryFn: async () => {
            switch (entityType) {
                case EntityType.Student: {
                    const res = await getScheduleForStudent(entityId, date);
                    return res.data;
                }
                case EntityType.Therapist: {
                    const res = await getScheduleForTherapist(entityId, date);
                    return res.data;
                }
                case EntityType.Class: {
                    const res = await getScheduleForClass(entityId, date);
                    return res.data;
                }
                default: {
                    return [];
                }
            }
        },
        enabled: Boolean(entityId && entityType),
    });

export const useScheduleWithDate = (
    entityType: EntityType,
    entityId: number,
    selectedDate: Dayjs
) => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    const { data: rawSchedule = [], isLoading, error, refetch } = useSchedule(
        entityType,
        entityId,
        formattedDate
    );

    const events: Slot[] = useMemo(
        () => rawSchedule.map(convertScheduleSlotDto),
        [rawSchedule]
    );

    return { events, isLoading, error, refetch };
};


type MutationWithSnackbarOptions<TData, TError, TVariables> = UseMutationOptions<
    TData,
    TError,
    TVariables
> & {
    successMessage?: string;
    errorMessage?: string;
    entityType?: EntityType;
    entityId?: number;
    invalidateQueries?: string[];
};

export function useMutationWithSnackbar<TData = unknown, TError = AxiosError, TVariables = void>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    {
        successMessage,
        errorMessage,
        entityType,
        entityId,
        invalidateQueries = ['schedule'],
        ...options
    }: MutationWithSnackbarOptions<TData, TError, TVariables> = {}
) {
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    return useMutation<TData, TError, TVariables>({
        mutationFn,
        ...options,
        onSuccess: (data, variables, context, mutation) => {
            if (successMessage) {
                showSnackbar(successMessage, 'success');
            }
            if (entityType && entityId) {
                queryClient.invalidateQueries({
                    queryKey: [...invalidateQueries, entityType, entityId],
                });
            }
            options.onSuccess?.(data, variables, context, mutation);
        },
        onError: (error: TError, variables, context, mutation) => {
            let msg = errorMessage || 'Wystąpił nieoczekiwany błąd';
            if (error instanceof AxiosError) {
                msg = error.response?.data?.message || msg;
            } else if (error instanceof Error) {
                msg = error.message;
            }
            showSnackbar(msg, 'error');
            options.onError?.(error, variables, context, mutation);
        },
    });
}

interface CreateStudentSlotProps {
    studentId: number;
    data: ScheduleSlotDto;
}
export const useCreateStudentScheduleSlot = (entityId: number) =>
    useMutationWithSnackbar(
        ({ studentId, data }: CreateStudentSlotProps) =>
            createScheduleSlot(EntityType.Student, studentId, data),
        {
            successMessage: 'Slot ucznia został utworzony',
            entityType: EntityType.Student,
            entityId,
        }
    );

interface UpdateStudentSlotProps {
    id: number;
    studentId: number;
    data: ScheduleSlotDto;
}

export const useUpdateScheduleSlotForAll = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, data }: { id: number; data: ScheduleSlotDto }) => updateScheduleSlot(id, data),
        {
            successMessage: 'Slot zaktualizowany pomyślnie',
            entityType,
            entityId,
        }
    );

export const useUpdateScheduleSlotForStudent = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, studentId, data }: UpdateStudentSlotProps) =>
            updateStudentScheduleSlot(studentId, id, data),
        {
            successMessage: 'Slot ucznia zaktualizowany pomyślnie',
            entityType,
            entityId,
        }
    );

interface DeleteStudentSlotProps {
    id: number;
    studentId: number;
}

export const useDeleteScheduleSlotForAll = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(({ id }: { id: number }) => deleteScheduleSlot(id), {
        successMessage: 'Slot usunięty pomyślnie',
        entityType,
        entityId,
    });

export const useClearSchedule = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityType: targetType }: { id: number; entityType: EntityType }) =>
            deleteSchedule(id, targetType),
        {
            successMessage: 'Plan wyczyszczony pomyślnie',
            entityType,
            entityId,
        }
    );

export const useDeleteScheduleSlotForStudent = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, studentId }: DeleteStudentSlotProps) => deleteStudentScheduleSlot(studentId, id),
        {
            successMessage: 'Slot ucznia usunięty pomyślnie',
            entityType,
            entityId,
        }
    );

interface CreateSlotProps {
    entityId: number;
    data: ScheduleSlotDto;
}
export const useCreateScheduleSlot = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ entityId: targetEntityId, data }: CreateSlotProps) =>
            createScheduleSlot(entityType, targetEntityId, data),
        {
            successMessage: 'Slot utworzony pomyślnie',
            entityType,
            entityId,
        }
    );

interface UpdateSlotForEntityProps {
    id: number;
    entityId: number;
    data: ScheduleSlotDto;
}
export const useUpdateScheduleSlotForEntity = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityId: targetEntityId, data }: UpdateSlotForEntityProps) =>
            updateStudentScheduleSlot(targetEntityId, id, data),
        {
            successMessage: 'Slot zaktualizowany pomyślnie',
            entityType,
            entityId,
        }
    );

interface DeleteSlotForEntityProps {
    id: number;
    entityId: number;
}
export const useDeleteScheduleSlotForEntity = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityId: targetEntityId }: DeleteSlotForEntityProps) =>
            deleteStudentScheduleSlot(targetEntityId, id),
        {
            successMessage: 'Slot usunięty pomyślnie',
            entityType,
            entityId,
        }
    );