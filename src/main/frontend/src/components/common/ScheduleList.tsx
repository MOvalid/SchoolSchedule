import React from 'react';
import { ScheduleSlotDto } from '../../types/types';
import { Box, Paper, List, ListItem, ListItemText, Typography } from '@mui/material';

interface ScheduleListProps {
    slots: ScheduleSlotDto[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ slots }) => {
    if (slots.length === 0) return null;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Grafik
            </Typography>
            <List>
                {slots.map((slot) => (
                    <Paper key={slot.id} sx={{ mb: 2, p: 2 }}>
                        <ListItem>
                            <ListItemText
                                primary={`Dzień: ${slot.dayOfWeek}, ${slot.startTime}–${slot.endTime}`}
                                secondary={`Sala: ${slot.room?.name ?? '-'}, Terapeuta: ${slot.therapist?.firstName ?? ''} ${slot.therapist?.lastName ?? ''}`}
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
};

export default ScheduleList;
