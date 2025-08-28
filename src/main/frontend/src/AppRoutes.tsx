import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import EntitySearchPage from './components/pages/EntitySearchPage';
import { EntityTypes } from './types/enums/entityTypes';
import ManageEntityPage from './components/pages/ManageEntityPage';
import { ScheduleCalendarPage } from './components/pages/ScheduleCalendarPage';

const AppRoutes = () => (
    <Router>
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, alignItems: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <Box
                            component="img"
                            src="/mspdion.png"
                            alt="mspdionLogo"
                            sx={{ width: 32, height: 32 }}
                        />
                        MSPDiON - SchedulON
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
                    <Button color="inherit" component={Link} to="/manage-entity">
                        Zarządzanie szkołą
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>

        <Box sx={{ mt: 4, px: 2 }}>
            <Routes>
                <Route
                    path="/students"
                    element={<EntitySearchPage entityType={EntityTypes.Student} />}
                />
                <Route
                    path="/therapists"
                    element={<EntitySearchPage entityType={EntityTypes.Therapist} />}
                />
                <Route
                    path="/classes"
                    element={<EntitySearchPage entityType={EntityTypes.Class} />}
                />
                <Route path="/manage-entity" element={<ManageEntityPage />} />

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
