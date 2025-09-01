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

interface SlotTextProps {
    slot: ScheduleSlotDto;
}

const styles: Record<string, SxProps<Theme>> = {
    paper: {
        mb: 2,
        p: 2,
    },
};

const ScheduleList: React.FC<ScheduleListProps> = ({ slots }) => {
    if (slots.length === 0) return null;

    const formatSlotPrimary = ({ slot }: SlotTextProps) => {
        return `Dzień: ${slot.dayOfWeek}, ${slot.startTime}–${slot.endTime}`;
    };

    const formatSlotSecondary = ({ slot }: SlotTextProps) => {
        const roomName = slot.room?.name ?? '-';
        const therapistName = slot.therapist
            ? `${slot.therapist.firstName} ${slot.therapist.lastName}`
            : '-';
        return `Sala: ${roomName}, Terapeuta: ${therapistName}`;
    };

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
                                primary={formatSlotPrimary({ slot })}
                                secondary={formatSlotSecondary({ slot })}
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
};

export default ScheduleList;
