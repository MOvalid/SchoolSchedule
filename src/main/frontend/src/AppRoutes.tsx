import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StudentSchedulePage from './components/pages/StudentSchedulePage';
import StudentScheduleCalendarPage from './components/pages/schedules/StudentScheduleCalendarPage';
import ClassSchedulePage from './components/pages/ClassSchedulePage';
import TherapistSchedulePage from './components/pages/TherapistSchedulePage';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

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
                </Box>
            </Toolbar>
        </AppBar>

        <Box sx={{ mt: 4, px: 2 }}>
            <Routes>
                <Route path="/students" element={<StudentSchedulePage />} />
                <Route path="/classes" element={<ClassSchedulePage />} />
                <Route path="/therapists" element={<TherapistSchedulePage />} />
                <Route
                    path="/schedule/student/:entityId"
                    element={<StudentScheduleCalendarPage />}
                />
                {/*<Route path="/schedule/:entityType/:entityId" element={<StudentScheduleCalendarPage />} />*/}
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
