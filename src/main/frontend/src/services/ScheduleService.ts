import api from '../api/api';
import { ScheduleSlotDto } from '../types/types';

export const getAllScheduleSlots = () => api.get<ScheduleSlotDto[]>('/schedules');

export const getScheduleSlotById = (id: number) => api.get<ScheduleSlotDto>(`/schedules/${id}`);

export const getScheduleForTherapist = (id: number) =>
    api.get<ScheduleSlotDto[]>(`/schedules/therapist/${id}`);

export const getScheduleForStudent = (id: number) =>
    api.get<ScheduleSlotDto[]>(`/schedules/student/${id}`);

export const getScheduleForClass = (id: number) =>
    api.get<ScheduleSlotDto[]>(`/schedules/class/${id}`);

export const createScheduleSlot = (data: ScheduleSlotDto) =>
    api.post<ScheduleSlotDto>('/schedules', data);

export const updateScheduleSlot = (id: number, data: ScheduleSlotDto) =>
    api.put<ScheduleSlotDto>(`/schedules/${id}`, data);

export const deleteScheduleSlot = (id: number) => api.delete(`/schedules/${id}`);
