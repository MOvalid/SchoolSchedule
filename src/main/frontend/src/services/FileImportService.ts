import axios from 'axios';
import { EntityType } from '../types/enums/entityType';

export interface FileImportResponse {
    success: boolean;
    message?: string;
    errors?: string[];
}

export const importFiles = async (
    entityType: EntityType,
    files: File[]
): Promise<FileImportResponse> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    formData.append('entityType', entityType);

    const { data } = await axios.post<FileImportResponse>(`import/upload`, formData, {
        baseURL: process.env.REACT_APP_API_BASE_URL,
    });

    return data;
};
