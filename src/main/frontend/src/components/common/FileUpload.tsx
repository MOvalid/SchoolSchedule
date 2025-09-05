import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, SxProps, Theme } from '@mui/material';
import { formatFileLabel, getHelperTexts } from '../../utils/FileUploadUtils';

interface FileUploadProps {
    label?: string;
    multiple?: boolean;
    accept?: string[];
    maxSizeMb?: number;
    onFileSelect: (files: File[]) => void;
    helperText?: string;
    resetTrigger?: number;
}

const dropZoneStyles: SxProps<Theme> = {
    border: '2px dashed #ccc',
    borderRadius: 2,
    padding: 2,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
};
const dropZoneActiveStyles: SxProps<Theme> = { borderColor: '#1976d2' };

const styles: Record<string, SxProps<Theme>> = {
    container: { mt: 2 },
    button: { width: '100%', mt: 1 },
    fileList: { mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 },
    fileItem: { fontSize: '0.875rem' },
    clearButtonBox: { display: 'flex', justifyContent: 'flex-end', mt: 1 },
    helperBox: { mt: 1, display: 'flex', flexDirection: 'column' },
    helperTextBox: { mt: 1 },
    errorText: (theme: Theme) => ({ color: theme.palette.error.main, mt: 1, fontSize: '0.875rem' }),
    helperText: (theme: Theme) => ({
        color: theme.palette.text.secondary,
        mt: 0.5,
        fontSize: '0.875rem',
    }),
    hiddenInput: { display: 'none' },
};

const FileUpload: React.FC<FileUploadProps> = ({
    label = 'Wybierz plik',
    multiple = false,
    accept = [],
    maxSizeMb,
    onFileSelect,
    helperText,
    resetTrigger,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const acceptString = accept.length > 0 ? accept.join(',') : undefined;

    useEffect(() => {
        if (resetTrigger !== undefined) {
            setSelectedFiles([]);
            setError(null);
            if (inputRef.current) inputRef.current.value = '';
        }
    }, [resetTrigger]);

    const validateByAccept = (file: File): boolean => {
        if (!accept || accept.length === 0) return true;
        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();
        return accept.some((pattern) => {
            const p = pattern.toLowerCase().trim();
            if (p.startsWith('.')) return name.endsWith(p);
            if (p.endsWith('/*')) return type.startsWith(p.replace('/*', '') + '/');
            return type === p;
        });
    };

    const validateBySize = (file: File): boolean => {
        if (!maxSizeMb) return true;
        return file.size <= maxSizeMb * 1024 * 1024;
    };

    const pickValidFiles = (files: File[]) => {
        const valid: File[] = [];
        const rejected: string[] = [];

        files.forEach((f) => {
            const okType = validateByAccept(f);
            const okSize = validateBySize(f);
            if (okType && okSize) valid.push(f);
            else {
                const why: string[] = [];
                if (!okType) why.push('niedozwolony typ');
                if (!okSize) why.push(`przekroczony rozmiar (${maxSizeMb} MB)`);
                rejected.push(`${f.name} (${why.join(', ')})`);
            }
        });

        setError(rejected.length > 0 ? `Odrzucono pliki: ${rejected.join('; ')}` : null);
        return valid;
    };

    const handleChooseClick = () => inputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const valid = pickValidFiles(files);
        setSelectedFiles(valid);
        onFileSelect(valid);
        e.target.value = '';
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0) return;
        const valid = pickValidFiles(multiple ? files : [files[0]]);
        setSelectedFiles(valid);
        onFileSelect(valid);
    };

    const clearSelection = useCallback(() => {
        setSelectedFiles([]);
        onFileSelect([]);
        setError(null);
    }, [onFileSelect]);

    const dropZoneSx: SxProps<Theme> = {
        ...dropZoneStyles,
        ...(isDragging ? dropZoneActiveStyles : {}),
    };

    const helperTexts = getHelperTexts(accept, maxSizeMb);

    return (
        <Box sx={styles.container}>
            <Box
                sx={dropZoneSx}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={handleChooseClick}
                role="button"
                aria-label="Przeciągnij i upuść pliki lub kliknij, aby wybrać"
            >
                <Typography variant="body1">Przeciągnij i upuść pliki tutaj</Typography>
                <Typography variant="body2">
                    lub kliknij, aby {multiple ? 'wybrać pliki' : 'wybrać plik'}
                </Typography>

                {!error && (
                    <Box sx={styles.helperBox}>
                        {helperTexts.map((text, idx) => (
                            <Typography key={idx} variant="caption" sx={styles.helperText}>
                                {text}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>

            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept={acceptString}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <Button variant="outlined" onClick={handleChooseClick} sx={styles.button}>
                {label}
            </Button>

            {selectedFiles.length > 0 && (
                <Box sx={styles.fileList}>
                    {selectedFiles.map((file, idx) => (
                        <Typography key={idx} sx={styles.fileItem}>
                            {formatFileLabel(file)}
                        </Typography>
                    ))}
                    <Box sx={styles.clearButtonBox}>
                        <Button size="small" onClick={clearSelection}>
                            Wyczyść wybór
                        </Button>
                    </Box>
                </Box>
            )}

            {error && <Typography sx={styles.errorText}>{error}</Typography>}

            {!error && helperText && (
                <Box sx={styles.helperTextBox}>
                    <Typography sx={styles.helperText}>{helperText}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default FileUpload;
