import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, SxProps, Theme } from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { AvailabilityDto, CreateAvailabilityDto } from '../../types/types';
import { useSnackbar } from '../../context/SnackbarContext';
import {
    useCreateAvailability,
    useDeleteAvailability,
    useGetAvailabilities,
    useUpdateAvailability,
} from '../../hooks/useAvailabilities';
import { BaseTable, Column } from '../common/BaseTable';
import { useTherapistById } from '../../hooks/useTherapists';
import { useStudentById } from '../../hooks/useStudents';
import { AvailabilityDialog } from '../common/AvailabilityDialog';
import { EntityTypes } from '../../types/enums/entityTypes';

const styles: Record<string, SxProps<Theme>> = {
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
    },
};

interface ManageAvailabilityPageProps {
    entityType: EntityTypes;
    entityId: number;
}

export const ManageAvailabilityPage: React.FC<ManageAvailabilityPageProps> = ({
    entityType,
    entityId,
}) => {
    const snackbar = useSnackbar();

    const { data: therapist, isLoading: therapistLoading } =
        entityType === 'THERAPIST' ? useTherapistById(entityId) : { data: null, isLoading: false };
    const { data: student, isLoading: studentLoading } =
        entityType === 'STUDENT' ? useStudentById(entityId) : { data: null, isLoading: false };

    const {
        data: availabilities,
        isLoading: availabilitiesLoading,
        error,
    } = useGetAvailabilities(entityId, entityType);

    const createMutation = useCreateAvailability(entityId, entityType);
    const updateMutation = useUpdateAvailability(entityId, entityType);
    const deleteMutation = useDeleteAvailability(entityId, entityType);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAvailability, setEditingAvailability] = useState<AvailabilityDto | null>(null);
    const [formValues, setFormValues] = useState<CreateAvailabilityDto>({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
    });
    const [isLoading, setIsLoading] = useState(false);

    const daysOfWeekLabels: Record<number, string> = {
        1: 'Poniedziałek',
        2: 'Wtorek',
        3: 'Środa',
        4: 'Czwartek',
        5: 'Piątek',
        6: 'Sobota',
        7: 'Niedziela',
    };

    const handleOpenDialog = (availability?: AvailabilityDto) => {
        if (availability) {
            setEditingAvailability(availability);
            setFormValues({
                dayOfWeek: availability.dayOfWeek,
                startTime: availability.startTime,
                endTime: availability.endTime,
            });
        } else {
            setEditingAvailability(null);
            setFormValues({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingAvailability(null);
    };

    const validateHours = () => {
        const [startHour, startMin] = formValues.startTime.split(':').map(Number);
        const [endHour, endMin] = formValues.endTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(startHour, startMin, 0, 0);
        const endDate = new Date();
        endDate.setHours(endHour, endMin, 0, 0);
        return startDate >= endDate;
    };

    const handleSave = async () => {
        if (validateHours()) {
            snackbar.showSnackbar(
                'Godzina rozpoczęcia musi być wcześniejsza niż godzina zakończenia',
                'warning'
            );
            return;
        }
        try {
            if (editingAvailability) {
                await updateMutation.mutateAsync({
                    availabilityId: editingAvailability.id!,
                    data: { ...editingAvailability, ...formValues },
                });
                snackbar.showSnackbar('Dostępność zaktualizowana', 'success');
            } else {
                await createMutation.mutateAsync(formValues);
                snackbar.showSnackbar('Dostępność dodana', 'success');
            }
        } catch {
            snackbar.showSnackbar('Błąd podczas zapisu', 'error');
        } finally {
            handleCloseDialog();
        }
    };

    const handleDelete = async (availabilityId: number) => {
        try {
            await deleteMutation.mutateAsync(availabilityId);
            snackbar.showSnackbar('Dostępność usunięta', 'success');
        } catch {
            snackbar.showSnackbar('Błąd podczas usuwania', 'error');
        }
    };

    const columns: Column<AvailabilityDto>[] = [
        {
            key: 'dayOfWeek',
            label: 'Dzień tygodnia',
            render: (row) => daysOfWeekLabels[row.dayOfWeek],
        },
        { key: 'startTime', label: 'Od' },
        { key: 'endTime', label: 'Do' },
        {
            key: 'actions',
            label: '',
            width: 120,
            align: 'right',
            render: (row) => (
                <>
                    <IconButton onClick={() => handleOpenDialog(row)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id!)}>
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    useEffect(() => {
        setIsLoading(therapistLoading || studentLoading || availabilitiesLoading);
    }, [therapistLoading, studentLoading, availabilitiesLoading]);

    if (isLoading) return <Typography>Ładowanie dostępności...</Typography>;
    if (error) return <Typography color="error">Błąd podczas ładowania</Typography>;

    const sortedAvailabilities = (availabilities ?? []).slice().sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
        return a.startTime.localeCompare(b.startTime);
    });

    const entityName =
        entityType === 'THERAPIST'
            ? `${therapist?.firstName} ${therapist?.lastName}`
            : `${student?.firstName} ${student?.lastName}`;

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={styles.pageHeader}>
                <Typography variant="h5">Zarządzanie dostępnością: {entityName}</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
                    Dodaj dostępność
                </Button>
            </Box>

            <BaseTable
                columns={columns}
                data={sortedAvailabilities}
                noDataMessage="Brak dostępności"
            />

            <AvailabilityDialog
                open={dialogOpen}
                editingAvailability={editingAvailability}
                formValues={formValues}
                onChange={setFormValues}
                onClose={handleCloseDialog}
                onSave={handleSave}
            />
        </Box>
    );
};
