import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import {
    getAllTherapists,
    createTherapist,
    updateTherapist,
    deleteTherapist,
} from '../services/TherapistService';
import { CreateTherapistDto, TherapistDto } from '../types/types';

const THERAPISTS_QUERY_KEY = ['therapists'];

export const useTherapists = () =>
    useQuery({
        queryKey: THERAPISTS_QUERY_KEY,
        queryFn: async () => (await getAllTherapists()).data,
    });

const useTherapistMutation = <TArgs, TResult = void>(
    mutationFn: (args: TArgs) => Promise<TResult>
): UseMutationResult<TResult, unknown, TArgs> => {
    const queryClient = useQueryClient();
    return useMutation<TResult, unknown, TArgs>({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: THERAPISTS_QUERY_KEY }),
    });
};

export const useCreateTherapist = () =>
    useTherapistMutation((data: CreateTherapistDto) => createTherapist(data));

export const useUpdateTherapist = () =>
    useTherapistMutation(({ id, data }: { id: number; data: TherapistDto }) =>
        updateTherapist(id, data)
    );

export const useDeleteTherapist = () => useTherapistMutation((id: number) => deleteTherapist(id));
