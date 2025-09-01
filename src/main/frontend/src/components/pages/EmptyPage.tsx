import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

interface EmptyPageProps {
    title?: string;
    description?: string;
}

const EmptyPage: React.FC<EmptyPageProps> = ({
    title = 'Brak zawartości',
    description = 'Wybierz jedną z zakładek powyżej, aby zacząć',
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                color: 'text.secondary',
            }}
        >
            <SentimentSatisfiedAltIcon sx={{ fontSize: 80, mb: 2, color: 'primary.main' }} />
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
        </Box>
    );
};

export default EmptyPage;
