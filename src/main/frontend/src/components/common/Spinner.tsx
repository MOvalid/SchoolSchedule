import React from 'react';
import { Box, CircularProgress, SxProps, Theme, useTheme } from '@mui/material';

interface SpinnerProps {
    fullScreen?: boolean;
    isLoading?: boolean;
}

const styles: Record<string, SxProps<Theme>> = {
    fullScreenContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1300,
    },
    inlineContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        zIndex: 10,
    },
};

export const Spinner: React.FC<SpinnerProps> = ({ fullScreen = false, isLoading = true }) => {
    const theme = useTheme();

    if (!isLoading) return null;

    const size = (() => {
        if (theme.breakpoints.values.xs) return 60;
        if (theme.breakpoints.values.sm) return 100;
        return 140;
    })();

    return (
        <Box sx={fullScreen ? styles.fullScreenContainer : styles.inlineContainer}>
            <CircularProgress size={size} />
        </Box>
    );
};
