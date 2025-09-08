import { SxProps, Theme } from '@mui/material';

export const pageContainer: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mt: 4,
};

export const paperContainer: SxProps<Theme> = {
    p: 3,
    width: '100%',
    maxWidth: 600,
    mb: 3,
};

export const searchSelectBox: SxProps<Theme> = {
    mb: 2,
    mt: 2,
};

export const wrapperBox: SxProps<Theme> = {
    width: '100%',
    maxWidth: 600,
};

export const actionGroupsContainer: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};
