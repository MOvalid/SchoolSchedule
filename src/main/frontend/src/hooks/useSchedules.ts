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
import { useEffect, useState } from 'react';
import { convertScheduleSlotDto } from '../utils/ScheduleSlotConverter';

type OnErrorFn = (message: string) => void;

export const useSchedules = () =>
    useQuery({ queryKey: ['schedules'], queryFn: async () => (await getAllScheduleSlots()).data });

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
                    return Promise.resolve([]);
                }
            }
        },
        enabled: !!entityId && !!entityType,
    });

export const useScheduleWithDate = (
    entityType: EntityType,
    entityId: number,
    selectedDate: Dayjs
) => {
    const {
        data: rawSchedule = [],
        isLoading,
        error,
        refetch,
    } = useSchedule(entityType, entityId, selectedDate.format('YYYY-MM-DD'));

    const [events, setEvents] = useState<Slot[]>([]);

    useEffect(() => {
        setEvents(rawSchedule.map(convertScheduleSlotDto));
    }, [rawSchedule]);

    useEffect(() => {
        if (entityId && entityType) refetch();
    }, [selectedDate, entityId, entityType, refetch]);

    return { events, isLoading, error, refetch };
};

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
        onSuccess: (data, variables, context) => {
            if (successMessage) {
                showSnackbar(successMessage, 'success');
            }
            if (entityType && entityId) {
                queryClient.invalidateQueries({
                    queryKey: [...invalidateQueries, entityType, entityId],
                });
            }
            options.onSuccess?.(data, variables, context);
        },
        onError: (error: TError, variables, context) => {
            let msg = errorMessage || 'Unexpected error occurred';
            if (error instanceof AxiosError) {
                msg = error.response?.data?.message || msg;
            } else if (error instanceof Error) {
                msg = error.message;
            }
            showSnackbar(msg, 'error');
            options.onError?.(error, variables, context);
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
        ({ studentId, data }) => createScheduleSlot(EntityType.Student, studentId, data),
        EntityType.Student,
        0,
        onError
    );

// UPDATE
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

// DELETE
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
        ({ id, entityType }: { id: number; entityType: EntityType }) =>
            deleteSchedule(id, entityType),
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

// -------------------- UNIVERSAL HOOKS --------------------

// CREATE generic slot for any entity
interface CreateSlotProps {
    entityId: number;
    data: ScheduleSlotDto;
}
export const useCreateScheduleSlot = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ entityId, data }: CreateSlotProps) => createScheduleSlot(entityType, entityId, data),
        {
            successMessage: 'Slot utworzony pomyślnie',
            entityType,
            entityId,
        }
    );

// UPDATE generic slot for any entity
interface UpdateSlotForEntityProps {
    id: number;
    entityId: number;
    data: ScheduleSlotDto;
}
export const useUpdateScheduleSlotForEntity = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityId, data }: UpdateSlotForEntityProps) =>
            updateStudentScheduleSlot(entityId, id, data),
        {
            successMessage: 'Slot zaktualizowany pomyślnie',
            entityType,
            entityId,
        }
    );

// DELETE generic slot for any entity
interface DeleteSlotForEntityProps {
    id: number;
    entityId: number;
}
export const useDeleteScheduleSlotForEntity = (entityType: EntityType, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityId }: DeleteSlotForEntityProps) => deleteStudentScheduleSlot(entityId, id),
        {
            successMessage: 'Slot usunięty pomyślnie',
            entityType,
            entityId,
        }
    );
