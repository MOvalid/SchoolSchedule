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
 * Formatuje ISO string daty na samą godzinę i minuty w formacie "HH:mm" bez zmiany strefy czasowej.
 *
 * @param isoString - data w formacie ISO, np. "2025-08-25T06:00:00.000Z"
 * @returns godzina w formacie "HH:mm", np. "06:00", lub "-" jeśli brak wartości
 */
export const formatHour = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

/**
 * Formatuje ISO string daty na format "YYYY-MM-DD" w strefie UTC.
 *
 * @param isoString - data w formacie ISO, np. "2025-08-25T06:00:00.000Z"
 * @returns data w formacie "YYYY-MM-DD", np. "2025-08-25", lub "-" jeśli brak wartości
 */
export const formatDate = (isoString?: string): string => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
};

export const getValidityText = (validFrom?: string, validTo?: string): string => {
    if (validFrom || validTo) {
        const fromText = validFrom ? formatDate(validFrom) : '-';
        const toText = validTo ? formatDate(validTo) : 'bezterminowo';
        return `${fromText}  →  ${toText}`;
    }
    return '-';
};

export const getTimeFromISO = (iso: string) => iso.slice(11, 16);
export const getDateFromISO = (iso?: string) => (iso ? iso.slice(0, 10) : '');
