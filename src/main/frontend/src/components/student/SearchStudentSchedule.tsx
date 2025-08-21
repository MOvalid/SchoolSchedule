import React, { useEffect, useState } from 'react';
import { StudentDto, ScheduleSlotDto } from '../../types/types';
import { getAllStudents } from '../../services/StudentService';
import { getScheduleForStudent } from '../../services/ScheduleService';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

const SearchStudentSchedule: React.FC = () => {
    const [students, setStudents] = useState<StudentDto[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [schedule, setSchedule] = useState<ScheduleSlotDto[]>([]);

    useEffect(() => {
        getAllStudents().then((res) => setStudents(res.data));
    }, []);

    useEffect(() => {
        if (selectedId !== '') {
            getScheduleForStudent(selectedId).then((res) => setSchedule(res.data));
        }
    }, [selectedId]);

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom>
                Wyszukaj ucznia
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="student-label">Uczeń</InputLabel>
                <Select
                    labelId="student-label"
                    value={selectedId}
                    label="Uczeń"
                    onChange={(e) => setSelectedId(e.target.value as number)}
                >
                    {students.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                            {s.firstName} {s.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {schedule.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Grafik ucznia
                    </Typography>
                    <List>
                        {schedule.map((slot) => (
                            <Paper key={slot.id} sx={{ mb: 2, p: 2 }}>
                                <ListItem>
                                    <ListItemText
                                        primary={`Dzień: ${slot.dayOfWeek}, ${slot.startTime}–${slot.endTime}`}
                                        secondary={
                                            <>
                                                Sala: {slot.room?.name || '–'}, Terapeuta:{' '}
                                                {slot.therapist?.firstName}{' '}
                                                {slot.therapist?.lastName}
                                            </>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default SearchStudentSchedule;
