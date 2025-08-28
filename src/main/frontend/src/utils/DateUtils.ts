/**
 * Konwertuje datę i godzinę w formacie string na ISO string w strefie UTC.
 *
 * @param dateStr - data w formacie "YYYY-MM-DD"
 * @param timeStr - godzina w formacie "HH:mm"
 * @returns ISO string w strefie UTC, np. "2025-08-25T06:00:00.000Z"
 */
export const toISOTime = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}:00Z`).toISOString();
};

/**
 * Formatuje ISO string daty na samą godzinę i minuty w formacie "HH:mm".
 *
 * @param isoString - data w formacie ISO, np. "2025-08-25T06:00:00.000Z"
 * @returns godzina w formacie "HH:mm", np. "06:00", lub "-" jeśli brak wartości
 */
export const formatHour = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formatuje przedział czasowy z dat ISO na czytelny format godzin "HH:mm - HH:mm".
 *
 * @param start - ISO string daty rozpoczęcia, np. "2025-08-25T06:00:00.000Z"
 * @param end - ISO string daty zakończenia, np. "2025-08-25T08:00:00.000Z"
 * @returns przedział godzin w formacie "HH:mm - HH:mm", np. "06:00 - 08:00"; jeśli brak wartości, używa "-"
 */
export const formatTimeRange = (start?: string, end?: string) => {
    const formattedStart = start ? formatHour(start) : '-';
    const formattedEnd = end ? formatHour(end) : '-';
    return `${formattedStart} - ${formattedEnd}`;
};
