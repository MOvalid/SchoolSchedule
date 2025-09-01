import { SxProps, Theme } from '@mui/material';

export const appBarStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

export const navButtonsBox: SxProps<Theme> = {
    display: 'flex',
    gap: 2,
};

export const mainContentBox: SxProps<Theme> = {
    mt: 4,
    px: 2,
};

export const emptyPageTypography: SxProps<Theme> = {
    mt: 8,
};
