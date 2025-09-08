import React from 'react';
import { Box, Button } from '@mui/material';

interface ToggleOption<T> {
    value: T;
    label: string;
    color?: 'primary' | 'secondary';
    onClick?: () => void;
}

interface ToggleButtonGroupBoxProps<T> {
    selected: T;
    onChange: (val: T) => void;
    options: ToggleOption<T>[];
}

function ToggleButtonGroupBox<T>({ selected, onChange, options }: ToggleButtonGroupBoxProps<T>) {
    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {options.map((opt) => (
                <Button
                    key={String(opt.value)}
                    variant={selected === opt.value ? 'contained' : 'outlined'}
                    color={opt.color || 'primary'}
                    onClick={() => {
                        onChange(opt.value);
                        if (opt.onClick) opt.onClick();
                    }}
                    fullWidth
                >
                    {opt.label}
                </Button>
            ))}
        </Box>
    );
}

export default ToggleButtonGroupBox;
