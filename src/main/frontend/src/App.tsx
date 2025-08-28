import React, { useEffect } from 'react';
import AppRoutes from './AppRoutes';
import { SnackbarProvider } from './context/SnackbarContext';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { lightTheme } from './theme';

function App() {
    const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
    const theme = prefersLightMode ? lightTheme : lightTheme;

    useEffect(() => {
        document.title = 'SchedulON (by MSPDiON)';
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <AppRoutes />
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
