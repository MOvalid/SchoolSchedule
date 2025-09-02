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
import { ScheduleSlotDto } from '../types/types';
import { EntityTypes } from '../types/enums/entityTypes';
import { AxiosError } from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

type OnErrorFn = (message: string) => void;

export const useSchedules = () =>
    useQuery({ queryKey: ['schedules'], queryFn: async () => (await getAllScheduleSlots()).data });

export const useSchedule = (entityType: EntityTypes, entityId: number) =>
    useQuery<ScheduleSlotDto[], Error>({
        queryKey: ['schedule', entityType, entityId],
        queryFn: async () => {
            switch (entityType) {
                case EntityTypes.Student: {
                    const res = await getScheduleForStudent(entityId);
                    return res.data;
                }
                case EntityTypes.Therapist: {
                    const res = await getScheduleForTherapist(entityId);
                    return res.data;
                }
                case EntityTypes.Class: {
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
    entityType: EntityTypes,
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
    entityType?: EntityTypes;
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
        ({ studentId, data }) => createScheduleSlot(EntityTypes.Student, studentId, data),
        EntityTypes.Student,
        0,
        onError
    );

// UPDATE
interface UpdateStudentSlotProps {
    id: number;
    studentId: number;
    data: ScheduleSlotDto;
}

export const useUpdateScheduleSlotForAll = (entityType: EntityTypes, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, data }: { id: number; data: ScheduleSlotDto }) => updateScheduleSlot(id, data),
        {
            successMessage: 'Slot zaktualizowany pomyślnie',
            entityType,
            entityId,
        }
    );

export const useUpdateScheduleSlotForStudent = (entityType: EntityTypes, entityId: number) =>
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
export const useDeleteScheduleSlotForAll = (entityType: EntityTypes, entityId: number) =>
    useMutationWithSnackbar(({ id }: { id: number }) => deleteScheduleSlot(id), {
        successMessage: 'Slot usunięty pomyślnie',
        entityType,
        entityId,
    });

export const useClearSchedule = (entityType: EntityTypes, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityType }: { id: number; entityType: EntityTypes }) =>
            deleteSchedule(id, entityType),
        {
            successMessage: 'Plan wyczyszczony pomyślnie',
            entityType,
            entityId,
        }
    );

export const useDeleteScheduleSlotForStudent = (entityType: EntityTypes, entityId: number) =>
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
export const useCreateScheduleSlot = (entityType: EntityTypes, entityId: number) =>
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
export const useUpdateScheduleSlotForEntity = (entityType: EntityTypes, entityId: number) =>
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
export const useDeleteScheduleSlotForEntity = (entityType: EntityTypes, entityId: number) =>
    useMutationWithSnackbar(
        ({ id, entityId }: DeleteSlotForEntityProps) => deleteStudentScheduleSlot(entityId, id),
        {
            successMessage: 'Slot usunięty pomyślnie',
            entityType,
            entityId,
        }
    );
