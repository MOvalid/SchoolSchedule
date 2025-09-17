import { useState } from 'react';
import { EntityType } from '../types/enums/entityType';
import { importFiles, FileImportResponse } from '../services/FileImportService';

export const useFileImport = () => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const uploadFiles = async (entityType: EntityType, files: File[]) => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        setValidationErrors([]);

        try {
            const response: FileImportResponse = await importFiles(entityType, files);

            if (response.success) {
                setSuccessMessage(response.message || 'Import zakończony sukcesem');
            } else {
                setErrorMessage(response.message || 'Wystąpił błąd podczas importu');
                if (response.errors) setValidationErrors(response.errors);
            }
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
                (err as Error).message ||
                'Błąd sieci';
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setValidationErrors([]);
    };

    return { loading, successMessage, errorMessage, validationErrors, uploadFiles, clearMessages };
};
