import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../services/StudentService';
import { StudentDto, ScheduleSlotDto } from '../types/types';
import { getScheduleForStudent } from '../services/ScheduleService';

export const useStudents = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: async () => (await getAllStudents()).data,
    });
};

export const useScheduleForStudent = (studentId: number) =>
    useQuery<ScheduleSlotDto[], Error>({
        queryKey: ['schedule', 'student', studentId],
        queryFn: () => getScheduleForStudent(studentId).then((res) => res.data),
        enabled: !!studentId,
    });

export const useCreateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: StudentDto) => createStudent(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
    });
};

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: StudentDto }) => updateStudent(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteStudent(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
    });
};
