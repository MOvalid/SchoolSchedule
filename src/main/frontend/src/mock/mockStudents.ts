import { StudentDto } from '../types/types';

export const mockStudents: StudentDto[] = [
    {
        id: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        arrivalTime: '08:00',
        departureTime: '14:00',
        studentClassId: 101,
    },
    {
        id: 2,
        firstName: 'Anna',
        lastName: 'Nowak',
        arrivalTime: '09:00',
        departureTime: '15:00',
        studentClassId: 102,
    },
];
