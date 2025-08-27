import api from '../api/api';
import { ScheduleSlotDto } from '../types/types';
import { EntityTypes } from '../types/enums/entityTypes';

export const getAllScheduleSlots = () => api.get<ScheduleSlotDto[]>('/schedules');

export const getScheduleSlotById = (id: number) => api.get<ScheduleSlotDto>(`/schedules/${id}`);

export const getScheduleForTherapist = (id: number) =>
    api.get<ScheduleSlotDto[]>(`/schedules/therapist/${id}`);

export const getScheduleForStudent = (id: number) =>
    api.get<ScheduleSlotDto[]>(`/schedules/student/${id}`);

export const getScheduleForClass = (id: number) =>
    api.get<ScheduleSlotDto[]>(`/schedules/class/${id}`);

export const createScheduleSlot = (
    entityType: EntityTypes,
    entityId: number,
    data: ScheduleSlotDto
) => api.post<ScheduleSlotDto>(`/schedules/${entityType}/${entityId}`, data);

export const updateScheduleSlot = (id: number, data: ScheduleSlotDto) =>
    api.put<ScheduleSlotDto>(`/schedules/${id}/all`, data);

export const updateStudentScheduleSlot = (studentId: number, id: number, data: ScheduleSlotDto) =>
    api.put<ScheduleSlotDto>(`/schedules/${id}/student/${studentId}`, data);

export const deleteScheduleSlot = (id: number) => api.delete(`/schedules/${id}`);

export const deleteStudentScheduleSlot = (studentId: number, id: number) =>
    api.delete<ScheduleSlotDto>(`/schedules/${id}/student/${studentId}`);
