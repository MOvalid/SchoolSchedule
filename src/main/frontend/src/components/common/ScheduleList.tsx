import React from 'react';
import { ScheduleSlotDto } from '../../types/types';
import {
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    SxProps,
    Theme,
} from '@mui/material';

interface ScheduleListProps {
    slots: ScheduleSlotDto[];
}

const styles: Record<string, SxProps<Theme>> = {
    paper: {
        mb: 2,
        p: 2,
    },
};

const ScheduleList: React.FC<ScheduleListProps> = ({ slots }) => {
    if (slots.length === 0) return null;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Grafik
            </Typography>
            <List>
                {slots.map((slot) => (
                    <Paper key={slot.id} sx={styles.paper}>
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
