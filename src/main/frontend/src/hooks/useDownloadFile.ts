import { useState } from 'react';
import { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
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

            const disposition = response.headers['content-disposition'];
            let filename = fallbackFilename;
            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^;"']+)/i);
                if (match?.[1]) {
                    filename = decodeURIComponent(match[1]);
                }
            }

            const blob = new Blob([response.data]);
            const href = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(href);
        } catch (err) {
            let message = 'Wystąpił błąd podczas pobierania pliku';

            if (isAxiosError(err) && err.response?.data) {
                try {
                    const decoder = new TextDecoder('utf-8');
                    const text = decoder.decode(err.response.data as ArrayBuffer);
                    const json = JSON.parse(text);
                    if (json.message) {
                        message = json.message;
                    }
                } catch {
                    if ((err as AxiosError).message) {
                        message = (err as AxiosError).message;
                    }
                }
            } else if (err instanceof Error) {
                message = err.message;
            }

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, download };
};
