import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { CreateTherapistAvailabilityDto } from '../../types/types';

const daysOfWeekLabels: Record<number, string> = {
    1: 'Poniedziałek',
    2: 'Wtorek',
    3: 'Środa',
    4: 'Czwartek',
    5: 'Piątek',
    6: 'Sobota',
    7: 'Niedziela',
};

interface AvailabilityFormProps {
    values: CreateTherapistAvailabilityDto;
    onChange: (values: CreateTherapistAvailabilityDto) => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ values, onChange }) => {
    return (
        <>
            <TextField
                select
                fullWidth
                margin="normal"
                label="Dzień tygodnia"
                value={values.dayOfWeek}
                onChange={(e) => onChange({ ...values, dayOfWeek: Number(e.target.value) })}
            >
                {Object.entries(daysOfWeekLabels).map(([key, label]) => (
                    <MenuItem key={key} value={Number(key)}>
                        {label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                fullWidth
                margin="normal"
                label="Godzina rozpoczęcia"
                type="time"
                value={values.startTime}
                onChange={(e) => onChange({ ...values, startTime: e.target.value })}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: { inputProps: { step: 300 } },
                }}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Godzina zakończenia"
                type="time"
                value={values.endTime}
                onChange={(e) => onChange({ ...values, endTime: e.target.value })}
                slotProps={{
                    inputLabel: { shrink: true },
                    input: { inputProps: { step: 300 } },
                }}
            />
        </>
    );
};
