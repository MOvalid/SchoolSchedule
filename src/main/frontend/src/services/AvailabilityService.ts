// src/services/availabilityService.ts
import api from '../api/api';
import { AvailabilityDto, CreateAvailabilityDto } from '../types/types';
import { EntityType } from '../types/enums/entityType';

export const getAvailabilities = (entityType: EntityType, entityId: number) =>
    api.get<AvailabilityDto[]>(`/${entityType.toLowerCase()}s/${entityId}/availabilities`);

export const createAvailability = (
    entityType: EntityType,
    entityId: number,
    data: CreateAvailabilityDto
) => api.post<AvailabilityDto>(`/${entityType.toLowerCase()}s/${entityId}/availabilities`, data);

export const updateAvailability = (
    entityType: EntityType,
    entityId: number,
    availabilityId: number,
    data: AvailabilityDto
) =>
    api.put<AvailabilityDto>(
        `/${entityType.toLowerCase()}s/${entityId}/availabilities/${availabilityId}`,
        data
    );

export const deleteAvailability = (
    entityType: EntityType,
    entityId: number,
    availabilityId: number
) => api.delete(`/${entityType.toLowerCase()}s/${entityId}/availabilities/${availabilityId}`);
