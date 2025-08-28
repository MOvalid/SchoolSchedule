import { Theme } from '@mui/material/styles';

export const getCalendarStyles = (theme: Theme) => ({
    '& .fc': {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    '& .fc .fc-daygrid-day-number': {
        color: theme.palette.primary.main,
        fontWeight: 600,
    },
    '& .fc .fc-event': {
        backgroundColor: theme.palette.secondary.main,
        border: `1px solid ${theme.palette.secondary.dark}`,
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.body2.fontSize,
    },
    '& .fc .fc-timegrid-slot-label': {
        color: theme.palette.text.secondary,
    },
});
