import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography, Container, Paper } from '@mui/material';
import { container, paper, buttonsBox } from '../../styles/homePage.styles';

const HomePage: React.FC = () => (
    <Container sx={container}>
        <Paper sx={paper}>
            <Typography variant="h3" gutterBottom>
                Witaj w MSPDiON - SchedulON
            </Typography>
            <Typography variant="h6" gutterBottom>
                Zarządzaj uczniami, klasami i terapeutami oraz planuj harmonogram w prosty sposób.
            </Typography>
            <Box sx={buttonsBox}>
                <Button variant="contained" component={Link} to="/students">
                    Przejdź do uczniów
                </Button>
                <Button variant="outlined" component={Link} to="/manage-entity">
                    Zarządzaj szkołą
                </Button>
            </Box>
        </Paper>
    </Container>
);

export default HomePage;
