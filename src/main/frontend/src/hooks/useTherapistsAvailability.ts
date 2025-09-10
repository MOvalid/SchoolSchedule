import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createTherapistAvailability,
    deleteTherapistAvailability,
    getTherapistAvailabilities,
    updateTherapistAvailability,
} from '../services/TherapistService';
import { CreateTherapistAvailabilityDto, TherapistAvailabilityDto } from '../types/types';

export const useTherapistAvailabilities = (therapistId: number) =>
    useQuery({
        queryKey: ['therapist', therapistId, 'availabilities'],
        queryFn: async () => (await getTherapistAvailabilities(therapistId)).data,
    });

const useTherapistAvailabilityMutation = <TArgs, TResult = void>(
    mutationFn: (args: TArgs) => Promise<TResult>,
    therapistId: number
): UseMutationResult<TResult, unknown, TArgs> => {
    const queryClient = useQueryClient();
    return useMutation<TResult, unknown, TArgs>({
        mutationFn,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['therapist', therapistId, 'availabilities'],
            }),
    });
};

export const useCreateTherapistAvailability = (therapistId: number) =>
    useTherapistAvailabilityMutation(
        (data: CreateTherapistAvailabilityDto) => createTherapistAvailability(therapistId, data),
        therapistId
    );

export const useUpdateTherapistAvailability = (therapistId: number) =>
    useTherapistAvailabilityMutation(
        ({ availabilityId, data }: { availabilityId: number; data: TherapistAvailabilityDto }) =>
            updateTherapistAvailability(therapistId, availabilityId, data),
        therapistId
    );

export const useDeleteTherapistAvailability = (therapistId: number) =>
    useTherapistAvailabilityMutation(
        (availabilityId: number) => deleteTherapistAvailability(therapistId, availabilityId),
        therapistId
    );
