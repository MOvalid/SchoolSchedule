import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createAvailability,
    deleteAvailability,
    getAvailabilities,
    updateAvailability,
} from '../services/AvailabilityService';
import { AvailabilityDto, CreateAvailabilityDto } from '../types/types';
import { EntityTypes } from '../types/enums/entityTypes';

export const useGetAvailabilities = (entityId: number, entityType: EntityTypes) =>
    useQuery({
        queryKey: [entityType, entityId, 'availabilities'],
        queryFn: async () => (await getAvailabilities(entityType, entityId)).data,
    });

const useAvailabilityMutation = <TArgs, TResult = void>(
    mutationFn: (args: TArgs) => Promise<TResult>,
    entityId: number,
    entityType: EntityTypes
): UseMutationResult<TResult, unknown, TArgs> => {
    const queryClient = useQueryClient();
    return useMutation<TResult, unknown, TArgs>({
        mutationFn,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: [entityType, entityId, 'availabilities'],
            }),
    });
};

export const useCreateAvailability = (entityId: number, entityType: EntityTypes) =>
    useAvailabilityMutation(
        (data: CreateAvailabilityDto) => createAvailability(entityType, entityId, data),
        entityId,
        entityType
    );

export const useUpdateAvailability = (entityId: number, entityType: EntityTypes) =>
    useAvailabilityMutation(
        ({ availabilityId, data }: { availabilityId: number; data: AvailabilityDto }) =>
            updateAvailability(entityType, entityId, availabilityId, data),
        entityId,
        entityType
    );

export const useDeleteAvailability = (entityId: number, entityType: EntityTypes) =>
    useAvailabilityMutation(
        (availabilityId: number) => deleteAvailability(entityType, entityId, availabilityId),
        entityId,
        entityType
    );
