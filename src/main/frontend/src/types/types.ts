export type Department = 'SCHOOL' | 'REHABILITATION';

export interface StudentDto {
    id?: number;
    firstName: string;
    lastName: string;
    arrivalTime?: string;
    departureTime?: string;
    studentClassId?: number;
    studentClass?: StudentClassDto;
}

export interface TherapistDto {
    id?: number;
    firstName: string;
    lastName: string;
    department?: Department;
}

export interface RoomDto {
    id?: number;
    name: string;
}

export interface StudentClassDto {
    id?: number;
    name: string;
    department?: Department;
}

export interface Slot {
    id?: string; // ID generowane przez FullCalendar
    slotId?: number; // ID z backendu (ScheduleSlotDto.id)
    title: string;
    therapistId?: number;
    roomId?: number;
    studentId?: number;
    studentClassId?: number;
    start: string; // ISO format, np. "2025-01-06T09:00:00"
    end: string;
}

export interface SlotFormValues {
    title: string;
    start: string;
    end: string;
    therapistId?: number;
    roomId?: number;
    studentId?: number;
    studentClassId?: number;
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

    studentId?: number;
    student?: StudentDto;

    studentClassId?: number;
    studentClass?: StudentClassDto;
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
