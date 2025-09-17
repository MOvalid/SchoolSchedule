import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, SxProps, Theme } from '@mui/material';
import FileUpload from '../common/FileUpload';
import { EntityType } from '../../types/enums/entityType';
import EntityTypeSelector from '../common/EntityTypeSelector';
import { useFileImport } from '../../hooks/useFileImport';
import { useSnackbar } from '../../context/SnackbarContext';
import BaseButton from '../common/BaseButton';
import DownloadIcon from '@mui/icons-material/Download';
import { useFileDownloader } from '../../hooks/useFileDownloader';

const styles: Record<string, SxProps<Theme>> = {
    paper: { p: 3, maxWidth: 600, margin: '0 auto', width: '100%' },
    title: { mb: 2 },
    groupLabel: { mt: 2, mb: 1, fontWeight: 600 },
    uploadBox: { mt: 2 },
    submitBtn: { mt: 3, width: '100%' },
    hint: (theme) => ({ mt: 2, color: theme.palette.text.secondary }),
    message: { mt: 2 },
    headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 },
};

const ImportPage: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [entityType, setEntityType] = useState<EntityType>(EntityType.Student);
    const [resetCounter, setResetCounter] = useState(0);

    const { showSnackbar } = useSnackbar();

    const { loading, successMessage, errorMessage, validationErrors, uploadFiles, clearMessages } =
        useFileImport();

    const {
        isLoading: downloading,
        error: downloadError,
        startDownload,
    } = useFileDownloader({
        url: `/templates/${entityType.toLowerCase()}`,
        fallbackFilename: `szablon_${entityType.toLowerCase()}.csv`,
    });

    const handleFileSelect = (files: File[]) => {
        setSelectedFiles(files);
        clearMessages();
    };

    const handleEntityTypeChange = (type: EntityType) => {
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

    useEffect(() => {
        if (downloadError) {
            showSnackbar(downloadError, 'error');
        }
    }, [downloadError]);

    return (
        <Box>
            <Paper sx={styles.paper}>
                <Box sx={styles.headerBox}>
                    <Typography variant="h6">Import danych</Typography>

                    <BaseButton
                        variant="outlined"
                        color="info"
                        isLoading={downloading}
                        onClick={startDownload}
                        startIcon={<DownloadIcon />}
                    >
                        Pobierz szablon
                    </BaseButton>
                </Box>

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

                <BaseButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    isLoading={loading}
                    onClick={handleUpload}
                    sx={styles.submitBtn}
                >
                    Wyślij do importu
                </BaseButton>

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
