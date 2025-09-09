import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { SnackbarProvider } from './context/SnackbarContext';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

dayjs.locale('pl');

function App() {
    const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
    const theme = prefersLightMode ? lightTheme : darkTheme;

    useEffect(() => {
        document.title = 'SchedulON (by MSPDiON)';
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                    <AppRoutes />
                </LocalizationProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
