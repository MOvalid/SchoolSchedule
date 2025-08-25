/**
 * Tworzy lokalną datę (bez przesunięcia do UTC) na podstawie dnia tygodnia i godziny "HH:mm"
 */
export const convertToDatetimeLocal = (dayOfWeek: number, time: string): string => {
    const now = new Date();
    const currentWeekMonday = new Date(now.setDate(now.getDate() - ((now.getDay() + 6) % 7))); // Poniedziałek

    const targetDate = new Date(currentWeekMonday);
    targetDate.setDate(currentWeekMonday.getDate() + (dayOfWeek - 1));

    const [hours, minutes] = time.split(':').map(Number);
    targetDate.setHours(hours, minutes, 0, 0);

    // Lokalny czas w formacie ISO, np. "2025-08-06T09:00:00"
    return targetDate.toISOString().slice(0, 19); // bez Z
};

/**
 * Dodaje lokalne przesunięcie czasowe do godziny "HH:mm"
 * @param time - godzina w formacie "HH:mm"
 * @returns string - przesunięta godzina w formacie "HH:mm"
 */
export const addTimezoneOffsetToTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);

    const date = new Date(Date.UTC(2000, 0, 1, hours, minutes));
    console.log(date);

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    console.log(localDate);

    const localHours = localDate.getHours().toString().padStart(2, '0');
    const localMinutes = localDate.getMinutes().toString().padStart(2, '0');

    return `${localHours}:${localMinutes}`;
};

export const toISOTime = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}:00Z`).toISOString();
};
