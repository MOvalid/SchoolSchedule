import { SxProps, Theme } from '@mui/material';

export const dialogTitleSx: SxProps<Theme> = {
    m: 0,
    p: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

export const titleTypographySx: SxProps<Theme> = {
    flexGrow: 1,
    ml: '8px',
    fontWeight: 700,
};

export const closeButtonSx: SxProps<Theme> = {
    color: (theme) => theme.palette.grey[500],
};

export const rowGridSx: SxProps<Theme> = {
    mb: 1,
    alignItems: 'center',
};

export const confirmDeleteStackSx: SxProps<Theme> = {
    mt: 2,
    spacing: 1.5,
};
