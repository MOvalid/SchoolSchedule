import { SxProps, Theme } from '@mui/material';

export const container: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    color: 'text.secondary',
};

export const icon: SxProps<Theme> = {
    fontSize: 80,
    mb: 2,
    color: 'primary.main',
};
