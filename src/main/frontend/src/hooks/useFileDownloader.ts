import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { useDownloadFile } from './useDownloadFile';

interface UseFileDownloadProps {
    url: string;
    fallbackFilename?: string;
    options?: AxiosRequestConfig;
}

export const useFileDownloader = ({ url, fallbackFilename, options }: UseFileDownloadProps) => {
    const { isLoading, error, download } = useDownloadFile();
    const [downloadUrl, setDownloadUrl] = useState<string>('');

    useEffect(() => {
        setDownloadUrl(url);
    }, [url]);

    const startDownload = () => {
        if (!downloadUrl) return;
        download(downloadUrl, fallbackFilename, options);
    };

    return {
        isLoading,
        error,
        startDownload,
    };
};
