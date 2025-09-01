import { SxProps, Theme } from '@mui/material';

export const container: SxProps<Theme> = {
    mt: 8,
};

export const paper: SxProps<Theme> = {
    p: 4,
    textAlign: 'center',
    borderRadius: 3,
    boxShadow: 3,
};

export const buttonsBox: SxProps<Theme> = {
    mt: 4,
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
};
