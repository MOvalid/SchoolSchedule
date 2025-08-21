import { ScheduleSlotDto } from '../types/types';

export const mockSchedule: ScheduleSlotDto[] = [
  {
    id: 1,
    title: 'Terapia 1',
    startTime: '09:00',
    endTime: '10:00',
    dayOfWeek: 1, // Poniedziałek
    therapistId: 1,
    studentId: 1,
    roomId: 1,
  },
  {
    id: 2,
    title: 'Terapia 2',
    startTime: '11:00',
    endTime: '12:00',
    dayOfWeek: 2, // Wtorek
    therapistId: 1,
    studentId: 1,
    roomId: 2,
  },
  {
    id: 3,
    title: 'Terapia 3',
    startTime: '12:00',
    endTime: '13:00',
    dayOfWeek: 2, // Wtorek
    therapistId: 1,
    studentId: 1,
    roomId: 2,
  },
];

