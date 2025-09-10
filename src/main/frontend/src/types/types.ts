import { Department } from './enums/department';
import { TherapistRole } from './enums/therapistRole';

export interface CreateStudentDto {
    firstName: string;
    lastName: string;
    arrivalTime?: string;
    departureTime?: string;
    studentClassId?: number;
}

export interface StudentDto {
    id: number;
    firstName: string;
    lastName: string;
    arrivalTime?: string;
    departureTime?: string;
    studentClassId?: number;
    studentClass?: StudentClassDto;
    availabilities?: AvailabilityDto[];
}

export interface CreateTherapistDto {
    firstName: string;
    lastName: string;
    role: TherapistRole;
    departments: Department[];
}

export interface TherapistDto {
    id: number;
    firstName: string;
    lastName: string;
    role: TherapistRole;
    departments: Department[];
    availabilities?: AvailabilityDto[];
}

export interface AvailabilityDto {
    id?: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface BusinessHoursDto {
    id?: number;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    color?: string;
    overlap?: boolean;
}

export interface CreateAvailabilityDto {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface RoomDto {
    id: number;
    name: string;
}

export interface CreateStudentClassDto {
    name: string;
    department?: Department;
}

export interface StudentClassDto {
    id: number;
    name: string;
    department?: Department;
}

export interface Slot {
    id?: string; // ID generowane przez FullCalendar
    slotId?: number; // ID z backendu (ScheduleSlotDto.id)
    title: string;
    therapistId?: number;
    roomId?: number;
    isIndividual?: boolean;
    studentIds?: number[];
    studentClassId?: number;
    start: string; // ISO format, np. "2025-01-06T09:00:00"
    end: string;
    validFrom: string;
    validTo?: string;
}

export interface SlotFormValues {
    title: string;
    start: string;
    end: string;
    therapistId?: number;
    isIndividual?: boolean;
    roomId?: number;
    studentIds: number[];
    studentClassId?: number;
    applyToAll: boolean;
    validFrom: string;
    validTo?: string;
}

export interface ScheduleSlotDto {
    id?: number;
    title: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;

    therapistId?: number;
    therapist?: TherapistDto;

    roomId?: number;
    room?: RoomDto;

    studentIds?: number[];
    students?: StudentDto[];

    studentClassId?: number;
    studentClass?: StudentClassDto;

    isIndividual?: boolean;

    validFrom: string;
    validTo?: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ErrorResponse {
    error: string;
    message?: string;
    status?: number;
}

export interface ScheduleSlotMutationParams {
    id?: number;
    studentIds?: number[];
    data: ScheduleSlotDto;
}

export interface UseScheduleHookResult<T> {
    data: T;
    isLoading: boolean;
    error?: Error;
}
