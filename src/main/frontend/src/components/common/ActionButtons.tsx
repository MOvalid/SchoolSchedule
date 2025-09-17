import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { EntityType } from '../../types/enums/entityType';
import { useFileDownloader } from '../../hooks/useFileDownloader';
import { useSnackbar } from '../../context/SnackbarContext';
import BaseButton from './BaseButton';
import excelIcon from '../../assets/icons/excel_outline.png';
import Icon from './Icon';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
    editMode: boolean;
    setEditMode: (val: boolean) => void;
    onClearSchedule: () => void;
    entityType: EntityType;
    entityId: number;
    fileNameSuffix?: string;
}

const ActionButtons: React.FC<Props> = ({
    editMode,
    setEditMode,
    onClearSchedule,
    entityType,
    entityId,
    fileNameSuffix = '',
}) => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const { isLoading, error, startDownload } = useFileDownloader({
        url: `/schedules/${entityType.toLowerCase()}/${entityId}/download?fileNameSuffix=${encodeURIComponent(fileNameSuffix)}`,
        fallbackFilename: 'plan_lekcji.xlsx',
    });

    useEffect(() => {
        if (error) {
            showSnackbar(error, 'error');
        }
    }, [error]);

    return (
        <Stack direction="row" spacing={2}>
            <Button
                variant="contained"
                color="inherit"
                onClick={() => setEditMode(!editMode)}
                startIcon={editMode ? <CheckIcon /> : <EditIcon />}
            >
                {editMode ? 'Zakończ edycję' : 'Edytuj'}
            </Button>

            <Button
                variant="contained"
                color="error"
                onClick={onClearSchedule}
                startIcon={<ClearIcon />}
            >
                Wyczyść
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={() => window.print()}
                startIcon={<PrintIcon />}
            >
                Drukuj
            </Button>

            <BaseButton
                isLoading={isLoading}
                onClick={startDownload}
                color="success"
                loadingText="Pobieranie..."
                startIcon={<Icon src={excelIcon} alt="Excel" />}
            >
                Pobierz Excel
            </BaseButton>

            <Button
                variant="outlined"
                color="info"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIcon />}
            >
                Powrót
            </Button>
        </Stack>
    );
};

export default ActionButtons;
