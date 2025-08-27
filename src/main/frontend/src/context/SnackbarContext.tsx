import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextProps {
    showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error('useSnackbar must be used within SnackbarProvider');
    return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<SnackbarType>('info');

    const showSnackbar = (msg: string, t: SnackbarType = 'info') => {
        setMessage(msg);
        setType(t);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={type} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
