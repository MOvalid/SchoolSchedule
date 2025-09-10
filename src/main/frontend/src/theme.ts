import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
import {
    white,
    black,
    primaryMain,
    secondaryMain,
    errorMain,
    warningMain,
    infoMain,
    successMain,
    lightBackgroundDefault,
    lightBackgroundPaper,
    lightTextPrimary,
    lightTextSecondary,
    lightTextDisabled,
    lightDivider,
    darkBackgroundDefault,
    darkBackgroundPaper,
    darkTextPrimary,
    darkTextSecondary,
    darkTextDisabled,
    darkDivider,
} from './styles/colors';

const typography = {
    fontFamily: 'Ubuntu, sans-serif',
    h6: { fontWeight: 700 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 600 },
};

const components = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                padding: '6px 16px',
            },
            containedPrimary: {
                color: white,
            },
            outlinedPrimary: {
                color: primaryMain,
                borderColor: primaryMain,
                '&:hover': {
                    backgroundColor: primaryMain + '20',
                    borderColor: primaryMain,
                },
            },
            outlinedInfo: {
                color: infoMain,
                borderColor: infoMain,
                '&:hover': {
                    backgroundColor: infoMain + '20',
                    borderColor: infoMain,
                },
            },
            containedInfo: {
                color: white,
                backgroundColor: infoMain,
                '&:hover': {
                    backgroundColor: infoMain,
                },
            },
        },
    },
    MuiCheckbox: {
        styleOverrides: {
            root: { color: primaryMain },
        },
    },
    MuiDialog: {
        styleOverrides: {
            paper: { borderRadius: 12 },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            head: ({ theme }: { theme: Theme }) => ({
                backgroundColor:
                    theme.palette.mode === 'light'
                        ? theme.palette.secondary.main
                        : theme.palette.secondary.dark,
                color: theme.palette.getContrastText(
                    theme.palette.mode === 'light'
                        ? theme.palette.secondary.main
                        : theme.palette.secondary.dark
                ),
                fontWeight: 700,
            }),
            body: ({ theme }: { theme: Theme }) => ({
                fontSize: '0.95rem',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }),
        },
    },

    MuiTableRow: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                '&:nth-of-type(odd)': {
                    backgroundColor:
                        theme.palette.mode === 'light'
                            ? theme.palette.background.default
                            : theme.palette.background.paper,
                },
                '&:hover': {
                    backgroundColor:
                        theme.palette.mode === 'light'
                            ? theme.palette.primary.main + '10'
                            : theme.palette.primary.dark + '20',
                },
            }),
        },
    },
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: primaryMain, contrastText: white },
        secondary: { main: secondaryMain, contrastText: white },
        error: { main: errorMain, contrastText: white },
        warning: { main: warningMain, contrastText: white },
        info: { main: infoMain, contrastText: white },
        success: { main: successMain, contrastText: white },
        background: { default: lightBackgroundDefault, paper: lightBackgroundPaper },
        text: {
            primary: lightTextPrimary,
            secondary: lightTextSecondary,
            disabled: lightTextDisabled,
        },
        divider: lightDivider,
    },
    typography,
    components,
} as ThemeOptions);

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: primaryMain, contrastText: black },
        secondary: { main: secondaryMain, contrastText: black },
        error: { main: errorMain, contrastText: black },
        warning: { main: warningMain, contrastText: black },
        info: { main: infoMain, contrastText: black },
        success: { main: successMain, contrastText: black },
        background: { default: darkBackgroundDefault, paper: darkBackgroundPaper },
        text: {
            primary: darkTextPrimary,
            secondary: darkTextSecondary,
            disabled: darkTextDisabled,
        },
        divider: darkDivider,
    },
    typography,
    components,
} as ThemeOptions);
