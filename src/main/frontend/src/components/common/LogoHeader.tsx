import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const styles: Record<string, SxProps<Theme>> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        userSelect: 'none',
    },
    logo: {
        width: 32,
        height: 32,
    },
    title: {
        fontWeight: 'bold',
    },
};

const LogoHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <Box onClick={handleClick} sx={styles.container}>
            <Box component="img" src="/mspdion.png" alt="mspdionLogo" sx={styles.logo} />
            <Typography variant="h6" sx={styles.title}>
                MSPDiON - SchedulON
            </Typography>
        </Box>
    );
};

export default LogoHeader;
