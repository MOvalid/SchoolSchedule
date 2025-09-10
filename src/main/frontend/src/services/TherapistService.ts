import api from '../api/api';
import {
    CreateTherapistAvailabilityDto,
    CreateTherapistDto,
    TherapistAvailabilityDto,
    TherapistDto,
} from '../types/types';

export const getAllTherapists = () => api.get<TherapistDto[]>('/therapists');

export const getTherapistById = (id: number) => api.get<TherapistDto>(`/therapists/${id}`);

export const createTherapist = (data: CreateTherapistDto) =>
    api.post<TherapistDto>('/therapists', data);

export const updateTherapist = (id: number, data: TherapistDto) =>
    api.put<TherapistDto>(`/therapists/${id}`, data);

export const deleteTherapist = (id: number) => api.delete(`/therapists/${id}`);

export const getTherapistAvailabilities = (therapistId: number) =>
    api.get<TherapistAvailabilityDto[]>(`/therapists/${therapistId}/availabilities`);

export const createTherapistAvailability = (
    therapistId: number,
    data: CreateTherapistAvailabilityDto
) => api.post<TherapistAvailabilityDto>(`/therapists/${therapistId}/availabilities`, data);

export const updateTherapistAvailability = (
    therapistId: number,
    availabilityId: number,
    data: TherapistAvailabilityDto
) =>
    api.put<TherapistAvailabilityDto>(
        `/therapists/${therapistId}/availabilities/${availabilityId}`,
        data
    );

export const deleteTherapistAvailability = (therapistId: number, availabilityId: number) =>
    api.delete(`/therapists/${therapistId}/availabilities/${availabilityId}`);
