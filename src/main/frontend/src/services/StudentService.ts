import { CreateStudentDto, StudentDto } from '../types/types';
import api from '../api/api';

export const getAllStudents = () => api.get<StudentDto[]>('/students');

export const getStudentsSorted = () => api.get<StudentDto[]>('/students/sorted');

export const getStudentsByClass = (classId: number) =>
    api.get<StudentDto[]>(`/students/class/${classId}`);

export const getStudentById = (id: number) => api.get<StudentDto>(`/students/${id}`);

export const createStudent = (data: CreateStudentDto) => api.post<StudentDto>('/students', data);

export const updateStudent = (id: number, data: StudentDto) =>
    api.put<StudentDto>(`/students/${id}`, data);

export const deleteStudent = (id: number) => api.delete(`/students/${id}`);
