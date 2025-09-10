import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import EntitySearchPage from './components/pages/EntitySearchPage';
import { EntityTypes } from './types/enums/entityTypes';
import ManageEntityPage from './components/pages/ManageEntityPage';
import { ScheduleCalendarPage } from './components/pages/ScheduleCalendarPage';
import HomePage from './components/pages/HomePage';
import LogoHeader from './components/common/LogoHeader';
import { appBarStyles, mainContentBox, navButtonsBox } from './styles/appBar.styles';
import EmptyPage from './components/pages/EmptyPage';
import ImportPage from './components/pages/ImportPage';
import { ManageAvailabilityPage } from './components/pages/ManageAvailabilityPage';

const AppRoutes = () => (
    <Router>
        <AppBar position="static">
            <Toolbar sx={appBarStyles}>
                <LogoHeader />

                <Box sx={navButtonsBox}>
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

        <Box sx={mainContentBox}>
            <Routes>
                <Route path="/" element={<HomePage />} />
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
                <Route path="/import" element={<ImportPage />} />
                <Route path="/schedule/:entityType/:entityId" element={<ScheduleCalendarPage />} />
                <Route path="/therapists/:id/availabilities" element={<ManageAvailabilityPage />} />

                <Route path="*" element={<EmptyPage />} />
            </Routes>
        </Box>
    </Router>
);

export default AppRoutes;
