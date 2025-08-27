import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../services/StudentService';
import { CreateStudentDto, StudentDto } from '../types/types';

const STUDENTS_QUERY_KEY = ['students'];

export const useStudents = () =>
    useQuery({
        queryKey: STUDENTS_QUERY_KEY,
        queryFn: async () => (await getAllStudents()).data,
    });

const useStudentMutation = <TArgs, TResult = void>(
    mutationFn: (args: TArgs) => Promise<TResult>
): UseMutationResult<TResult, unknown, TArgs> => {
    const queryClient = useQueryClient();
    return useMutation<TResult, unknown, TArgs>({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY }),
    });
};

export default useStudentMutation;

export const useCreateStudent = () =>
    useStudentMutation((data: CreateStudentDto) => createStudent(data));

export const useUpdateStudent = () =>
    useStudentMutation(({ id, data }: { id: number; data: StudentDto }) => updateStudent(id, data));

export const useDeleteStudent = () => useStudentMutation((id: number) => deleteStudent(id));
