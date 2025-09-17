import React from 'react';
import { Button, CircularProgress } from '@mui/material';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    loadingText?: string;
    children: React.ReactNode;
    startIcon?: React.ReactNode;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant?: 'text' | 'outlined' | 'contained';
}

const BaseButton: React.FC<BaseButtonProps> = ({
    isLoading,
    loadingText = 'Ładowanie...',
    children,
    startIcon,
    color = 'primary',
    variant = 'contained',
    disabled,
    ...rest
}) => {
    return (
        <Button
            variant={variant}
            color={color}
            disabled={isLoading || disabled}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : startIcon}
            {...rest}
        >
            {isLoading ? loadingText : children}
        </Button>
    );
};

export default BaseButton;
