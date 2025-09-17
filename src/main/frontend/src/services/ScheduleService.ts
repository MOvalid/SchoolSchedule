import api from '../api/api';
import { ScheduleSlotDto } from '../types/types';
import { EntityType } from '../types/enums/entityType';

export const getAllScheduleSlots = (date?: string) =>
    api.get<ScheduleSlotDto[]>(`/schedules${date ? `?date=${date}` : ''}`);

export const getScheduleSlotById = (id: number) => api.get<ScheduleSlotDto>(`/schedules/${id}`);

export const getScheduleForTherapist = (id: number, date?: string) =>
    api.get<ScheduleSlotDto[]>(`/schedules/therapist/${id}${date ? `?date=${date}` : ''}`);

export const getScheduleForStudent = (id: number, date?: string) =>
    api.get<ScheduleSlotDto[]>(`/schedules/student/${id}${date ? `?date=${date}` : ''}`);

export const getScheduleForClass = (id: number, date?: string) =>
    api.get<ScheduleSlotDto[]>(`/schedules/class/${id}${date ? `?date=${date}` : ''}`);

export const createScheduleSlot = (
    entityType: EntityType,
    entityId: number,
    data: ScheduleSlotDto
) => api.post<ScheduleSlotDto>(`/schedules/${entityType}/${entityId}`, data);

export const updateScheduleSlot = (id: number, data: ScheduleSlotDto) =>
    api.put<ScheduleSlotDto>(`/schedules/${id}/all`, data);

export const updateStudentScheduleSlot = (studentId: number, id: number, data: ScheduleSlotDto) =>
    api.put<ScheduleSlotDto>(`/schedules/${id}/student/${studentId}`, data);

export const deleteScheduleSlot = (id: number) => api.delete(`/schedules/${id}`);

export const deleteSchedule = (entityId: number, entityType: EntityType) =>
    api.delete(`/schedules/${entityType}/${entityId}`);

export const deleteStudentScheduleSlot = (studentId: number, id: number) =>
    api.delete<ScheduleSlotDto>(`/schedules/${id}/student/${studentId}`);
