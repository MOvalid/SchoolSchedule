export const getHelperTexts = (accept?: string[], maxSizeMb?: number): string[] => {
    const texts: string[] = [];
    if (accept && accept.length > 0) {
        texts.push(`Dozwolone: ${accept.join(', ')}`);
    }
    if (maxSizeMb) {
        texts.push(`Maksymalny rozmiar: ${maxSizeMb} MB`);
    }
    return texts;
};

/**
 * Formatuje nazwę pliku i jego rozmiar w KB
 */
export const formatFileLabel = (file: File): string => {
    const sizeKb = (file.size / 1024).toFixed(2);
    return `${file.name} (${sizeKb} KB)`;
};
