import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, CircularProgress, SxProps, Theme } from '@mui/material';
import FileUpload from '../common/FileUpload';
import { EntityTypes } from '../../types/enums/entityTypes';
import EntityTypeSelector from '../common/EntityTypeSelector';
import { useFileImport } from '../../hooks/useFileImport';
import { useSnackbar } from '../../context/SnackbarContext';

const styles: Record<string, SxProps<Theme>> = {
    container: { p: 3 },
    paper: { p: 3, maxWidth: 560, margin: '0 auto' },
    title: { mb: 2 },
    groupLabel: { mt: 2, mb: 1, fontWeight: 600 },
    uploadBox: { mt: 2 },
    submitBtn: { mt: 3, width: '100%' },
    hint: (theme) => ({ mt: 2, color: theme.palette.text.secondary }),
    message: { mt: 2 },
};

const ImportPage: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [entityType, setEntityType] = useState<EntityTypes>(EntityTypes.Student);
    const [resetCounter, setResetCounter] = useState(0);

    const { showSnackbar } = useSnackbar();

    const { loading, successMessage, errorMessage, validationErrors, uploadFiles, clearMessages } =
        useFileImport();

    const handleFileSelect = (files: File[]) => {
        setSelectedFiles(files);
        clearMessages();
    };

    const handleEntityTypeChange = (type: EntityTypes) => {
        setEntityType(type);
        setSelectedFiles([]);
        clearMessages();
        setResetCounter((prev) => prev + 1);
    };

    const handleUpload = () => {
        if (!entityType || selectedFiles.length === 0) {
            showSnackbar('Wybierz encję i plik do importu!', 'warning');
            return;
        }
        uploadFiles(entityType, selectedFiles);
    };

    useEffect(() => {
        if (successMessage) {
            showSnackbar(successMessage, 'success');
            setSelectedFiles([]);
            setResetCounter((prev) => prev + 1);
        } else if (errorMessage || validationErrors.length > 0) {
            const allErrors = [...validationErrors];
            if (errorMessage) allErrors.unshift(errorMessage);
            showSnackbar(allErrors.join('\n'), 'error');
        }
    }, [successMessage, errorMessage, validationErrors]);

    return (
        <Box sx={styles.container}>
            <Paper sx={styles.paper}>
                <Typography variant="h6" sx={styles.title}>
                    Import danych
                </Typography>

                <Typography variant="body2" sx={styles.groupLabel}>
                    Wybierz encję do importu
                </Typography>

                <EntityTypeSelector selected={entityType} onChange={handleEntityTypeChange} />

                <Box sx={styles.uploadBox}>
                    <FileUpload
                        label="Wybierz plik (CSV / XLSX)"
                        multiple={true}
                        accept={['.csv', '.xlsx']}
                        maxSizeMb={10}
                        onFileSelect={handleFileSelect}
                        helperText="Obsługiwane formaty: CSV (UTF-8), XLSX. Maks. 10 MB."
                        resetTrigger={resetCounter}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading || selectedFiles.length === 0}
                    onClick={handleUpload}
                    sx={styles.submitBtn}
                >
                    {loading ? <CircularProgress size={24} /> : 'Wyślij do importu'}
                </Button>

                {validationErrors.length > 0 && (
                    <Box sx={styles.message}>
                        {validationErrors.map((err, idx) => (
                            <Typography key={idx} sx={{ color: 'red' }}>
                                {err}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Typography variant="body2" sx={styles.hint}>
                    Wskazówka: Jeżeli import dotyczy uczniów/terapeutów powiązanych z klasami,
                    upewnij się, że nazwy klas istnieją lub dołącz arkusz z klasami.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ImportPage;
