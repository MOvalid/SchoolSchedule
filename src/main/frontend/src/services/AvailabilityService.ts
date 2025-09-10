// src/services/availabilityService.ts
import api from '../api/api';
import { AvailabilityDto, CreateAvailabilityDto } from '../types/types';
import { EntityTypes } from '../types/enums/entityTypes';

export const getAvailabilities = (entityType: EntityTypes, entityId: number) =>
    api.get<AvailabilityDto[]>(`/${entityType.toLowerCase()}s/${entityId}/availabilities`);

export const createAvailability = (
    entityType: EntityTypes,
    entityId: number,
    data: CreateAvailabilityDto
) => api.post<AvailabilityDto>(`/${entityType.toLowerCase()}s/${entityId}/availabilities`, data);

export const updateAvailability = (
    entityType: EntityTypes,
    entityId: number,
    availabilityId: number,
    data: AvailabilityDto
) =>
    api.put<AvailabilityDto>(
        `/${entityType.toLowerCase()}s/${entityId}/availabilities/${availabilityId}`,
        data
    );

export const deleteAvailability = (
    entityType: EntityTypes,
    entityId: number,
    availabilityId: number
) => api.delete(`/${entityType.toLowerCase()}s/${entityId}/availabilities/${availabilityId}`);
