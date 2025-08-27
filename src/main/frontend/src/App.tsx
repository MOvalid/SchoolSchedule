import React from 'react';
import AppRoutes from './AppRoutes';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {
    return (
        <SnackbarProvider>
            <AppRoutes />
        </SnackbarProvider>
    );
}

export default App;
