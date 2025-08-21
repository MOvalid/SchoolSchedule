import api from '../api/api';
import { TherapistDto } from '../types/types';

export const getAllTherapists = () => api.get<TherapistDto[]>('/therapists');

export const getTherapistById = (id: number) =>
  api.get<TherapistDto>(`/therapists/${id}`);

export const createTherapist = (data: TherapistDto) =>
  api.post<TherapistDto>('/therapists', data);

export const updateTherapist = (id: number, data: TherapistDto) =>
  api.put<TherapistDto>(`/therapists/${id}`, data);

export const deleteTherapist = (id: number) =>
  api.delete(`/therapists/${id}`);
