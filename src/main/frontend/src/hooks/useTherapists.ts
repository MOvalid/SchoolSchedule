import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllTherapists,
    createTherapist,
    updateTherapist,
    deleteTherapist,
} from '../services/TherapistService';
import { TherapistDto } from '../types/types';

export const useTherapists = () =>
    useQuery({
        queryKey: ['therapists'],
        queryFn: async () => (await getAllTherapists()).data,
    });

export const useCreateTherapist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TherapistDto) => createTherapist(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['therapists'] }),
    });
};

export const useUpdateTherapist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TherapistDto }) => updateTherapist(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['therapists'] }),
    });
};

export const useDeleteTherapist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteTherapist(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['therapists'] }),
    });
};
