import api from '../api/api';
import { CreateStudentClassDto, StudentClassDto } from '../types/types';

export const getAllClasses = () => api.get<StudentClassDto[]>('/classes');

export const getClassById = (id: number) => api.get<StudentClassDto>(`/classes/${id}`);

export const createClass = (data: CreateStudentClassDto) =>
    api.post<StudentClassDto>('/classes', data);

export const updateClass = (id: number, data: StudentClassDto) =>
    api.put<StudentClassDto>(`/classes/${id}`, data);

export const deleteClass = (id: number) => api.delete(`/classes/${id}`);
