import React, { useEffect, useState } from 'react';
import { StudentClassDto, ScheduleSlotDto } from '../../types/types';
import { getAllClasses } from '../../services/StudentClassService';
import { getScheduleForClass } from '../../services/ScheduleService';
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

const SearchClassSchedule: React.FC = () => {
    const [classes, setClasses] = useState<StudentClassDto[]>([]);
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const [schedule, setSchedule] = useState<ScheduleSlotDto[]>([]);

    useEffect(() => {
        getAllClasses().then((res) => setClasses(res.data));
    }, []);

    useEffect(() => {
        if (selectedId !== '') {
            getScheduleForClass(selectedId).then((res) => setSchedule(res.data));
        }
    }, [selectedId]);

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom>
                Wyszukaj klasę
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="class-label">Klasa</InputLabel>
                <Select
                    labelId="class-label"
                    value={selectedId}
                    label="Klasa"
                    onChange={(e) => setSelectedId(e.target.value as number)}
                >
                    {classes.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {schedule.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Grafik klasy
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

export default SearchClassSchedule;
