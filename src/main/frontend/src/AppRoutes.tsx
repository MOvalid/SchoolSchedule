import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import CreateEntityPage from './components/pages/CreateEntityPage';
import EntitySchedulePage from './components/common/EntitySchedulePage';
import { ScheduleCalendarPage } from './components/common/CommonScheduleCalendarPage';
import { EntityTypes } from './types/enums/entityTypes';

const AppRoutes = () => (
    <Router>
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        School Schedule App
                    </Typography>
                    <Button color="inherit" component={Link} to="/students">
                        Uczniowie
                    </Button>
                    <Button color="inherit" component={Link} to="/classes">
                        Klasy
                    </Button>
                    <Button color="inherit" component={Link} to="/therapists">
                        Terapeuci
                    </Button>
                    <Button color="inherit" component={Link} to="/create-entity">
                        Zarządzanie szkołą
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>

        <Box sx={{ mt: 4, px: 2 }}>
            <Routes>
                <Route
                    path="/students"
                    element={<EntitySchedulePage entityType={EntityTypes.Student} />}
                />
                <Route
                    path="/therapists"
                    element={<EntitySchedulePage entityType={EntityTypes.Therapist} />}
                />
                <Route
                    path="/classes"
                    element={<EntitySchedulePage entityType={EntityTypes.Class} />}
                />
                <Route path="/create-entity" element={<CreateEntityPage />} />

                <Route path="/schedule/:entityType/:entityId" element={<ScheduleCalendarPage />} />

                <Route
                    path="*"
                    element={
                        <Typography variant="h6" align="center" sx={{ mt: 8 }}>
                            Wybierz jedną z zakładek powyżej, aby zacząć
                        </Typography>
                    }
                />
            </Routes>
        </Box>
    </Router>
);

export default AppRoutes;
