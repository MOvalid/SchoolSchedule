import React from 'react';
import { Box, SxProps } from '@mui/material';
import BaseButton from './BaseButton';

interface ToggleOption<T> {
    value: T;
    label: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'inherit'; // dopasuj do BaseButton
    onClick?: () => void;
}

interface ToggleButtonGroupBoxProps<T> {
    selected: T;
    onChange: (val: T) => void;
    options: ToggleOption<T>[];
}

const boxStyles: SxProps = { display: 'flex', gap: 1 };

function ToggleButtonGroupBox<T>({ selected, onChange, options }: ToggleButtonGroupBoxProps<T>) {
    return (
        <Box sx={boxStyles}>
            {options.map((opt) => (
                <BaseButton
                    key={String(opt.value)}
                    color={opt.color || 'primary'}
                    variant={selected === opt.value ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => {
                        onChange(opt.value);
                        if (opt.onClick) opt.onClick();
                    }}
                >
                    {opt.label}
                </BaseButton>
            ))}
        </Box>
    );
}

export default ToggleButtonGroupBox;
