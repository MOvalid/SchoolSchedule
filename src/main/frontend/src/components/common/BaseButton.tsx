import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface BaseButtonProps extends Omit<ButtonProps, 'onClick'> {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
    onClick: () => void;
    startIcon?: React.ReactNode;
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
