import { Theme } from '@mui/material/styles';

export const getCalendarStyles = (theme: Theme) => ({
    '& .fc': {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
    },
    '& .fc .fc-col-header-cell': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontWeight: 600,
    },
    '& .fc .fc-col-header-cell-cushion': {
        color: theme.palette.text.primary,
    },
    '& .fc .fc-timegrid-axis': {
        backgroundColor: theme.palette.background.default,
    },
    '& .fc .fc-daygrid-day-number': {
        color: theme.palette.text.primary,
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
        fontSize: theme.typography.body2.fontSize,
    },
    '& .fc .fc-daygrid-day': {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
    },
    '& .fc .fc-daygrid-day:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '& .fc .fc-event-title': {
        fontWeight: 500,
    },
    '& .fc .fc-event-time': {
        fontSize: theme.typography.caption.fontSize,
    },
});
