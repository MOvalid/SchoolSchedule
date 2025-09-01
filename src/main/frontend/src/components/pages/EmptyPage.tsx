import React from 'react';
import { Box, Typography } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { container, icon } from '../../styles/emptyPage.styles';

interface EmptyPageProps {
    title?: string;
    description?: string;
}

const EmptyPage: React.FC<EmptyPageProps> = ({
    title = 'Brak zawartości',
    description = 'Wybierz jedną z zakładek powyżej, aby zacząć',
}) => {
    return (
        <Box sx={container}>
            <SentimentSatisfiedAltIcon sx={icon} />
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1">{description}</Typography>
        </Box>
    );
};

export default EmptyPage;
