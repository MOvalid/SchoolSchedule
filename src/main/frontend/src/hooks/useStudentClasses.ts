import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllClasses,
    createClass,
    updateClass,
    deleteClass,
} from '../services/StudentClassService';
import { StudentClassDto } from '../types/types';

export const useStudentClasses = () =>
    useQuery({
        queryKey: ['studentClasses'],
        queryFn: async () => (await getAllClasses()).data,
    });

export const useCreateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: StudentClassDto) => createClass(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studentClasses'] }),
    });
};

export const useUpdateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: StudentClassDto }) => updateClass(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studentClasses'] }),
    });
};

export const useDeleteClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteClass(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studentClasses'] }),
    });
};
