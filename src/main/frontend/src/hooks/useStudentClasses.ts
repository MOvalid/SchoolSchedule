import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import {
    getAllClasses,
    createClass,
    updateClass,
    deleteClass,
} from '../services/StudentClassService';
import { CreateStudentClassDto, StudentClassDto } from '../types/types';

const STUDENT_CLASSES_QUERY_KEY = ['studentClasses'];

export const useStudentClasses = () =>
    useQuery({
        queryKey: STUDENT_CLASSES_QUERY_KEY,
        queryFn: async () => (await getAllClasses()).data,
    });

const useStudentClassMutation = <TArgs, TResult = void>(
    mutationFn: (args: TArgs) => Promise<TResult>
): UseMutationResult<TResult, unknown, TArgs> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: STUDENT_CLASSES_QUERY_KEY }),
    });
};

export const useCreateClass = () =>
    useStudentClassMutation((data: CreateStudentClassDto) => createClass(data));

export const useUpdateClass = () =>
    useStudentClassMutation(({ id, data }: { id: number; data: StudentClassDto }) =>
        updateClass(id, data)
    );

export const useDeleteClass = () => useStudentClassMutation((id: number) => deleteClass(id));
