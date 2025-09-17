import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import api from '../api/api';

export type UseDownloadFileResult = {
    isLoading: boolean;
    error: string | null;
    download: (
        url: string,
        fallbackFilename?: string,
        options?: AxiosRequestConfig
    ) => Promise<void>;
};

/**
 * Hook do pobierania plików binarnych (xlsx, pdf, zip) z backendu.
 * Obsługuje odczyt nazwy pliku z nagłówka Content-Disposition.
 */
export const useDownloadFile = (): UseDownloadFileResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const download = async (
        url: string,
        fallbackFilename: string = `${Date.now()}.xlsx`,
        options?: AxiosRequestConfig
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url,
                responseType: 'arraybuffer',
                headers: { 'Content-Type': 'blob' },
                ...options,
            };

            const response = await api.request(config);

            const blob = new Blob([response.data]);
            const disposition = response.headers['content-disposition'];
            let filename = fallbackFilename;

            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^;"']+)/i);
                if (match?.[1]) {
                    filename = decodeURIComponent(match[1]);
                }
            }

            const href = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(href);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, download };
};
