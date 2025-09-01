import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    SxProps,
    Theme,
} from '@mui/material';
import { useCreateStudent, useUpdateStudent } from '../../hooks/useStudents';
import { useStudentClasses } from '../../hooks/useStudentClasses';
import { CreateStudentDto, StudentDto } from '../../types/types';
import { useSnackbar } from '../../context/SnackbarContext';

interface Props {
    mode?: 'create' | 'edit';
    initialData?: StudentDto;
    onSuccess?: () => void;
}

const styles: Record<string, SxProps<Theme>> = {
    buttonBox: {
        display: 'flex',
        justifyContent: 'flex-end',
        mt: 2,
    },
    button: {
        width: '40%',
    },
};

export const StudentForm: React.FC<Props> = ({ mode = 'create', initialData, onSuccess }) => {
    const snackbar = useSnackbar();

    const [formValues, setFormValues] = useState<CreateStudentDto>({
        firstName: '',
        lastName: '',
        studentClassId: undefined,
        arrivalTime: '',
        departureTime: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const createStudent = useCreateStudent();
    const updateStudent = useUpdateStudent();
    const { data: classes = [], isLoading } = useStudentClasses();

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormValues({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                studentClassId: initialData.studentClassId,
                arrivalTime: initialData.arrivalTime || '',
                departureTime: initialData.departureTime || '',
            });
        }
    }, [mode, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const handleSelectChange = (value: number) => {
        setFormValues({ ...formValues, studentClassId: value });
        setErrors((prev) => ({ ...prev, studentClassId: '' }));
    };

    const handleSubmit = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formValues.firstName) newErrors.firstName = 'Wymagane';
        if (!formValues.lastName) newErrors.lastName = 'Wymagane';
        if (!formValues.studentClassId) newErrors.studentClassId = 'Wymagane';

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        if (mode === 'create') {
            createStudent.mutate(formValues, {
                onSuccess: () => {
                    onSuccess?.();
                    setFormValues({
                        firstName: '',
                        lastName: '',
                        studentClassId: undefined,
                        arrivalTime: '',
                        departureTime: '',
                    });
                    snackbar.showSnackbar('Uczeń został dodany pomyślnie!', 'success');
                },
                onError: () => {
                    snackbar.showSnackbar('Błąd podczas dodawania ucznia.', 'error');
                },
            });
        } else if (mode === 'edit' && initialData) {
            updateStudent.mutate(
                { id: initialData.id, data: { id: initialData.id, ...formValues } },
                {
                    onSuccess: () => {
                        onSuccess?.();
                        snackbar.showSnackbar('Uczeń został zaktualizowany pomyślnie!', 'success');
                    },
                    onError: () => {
                        snackbar.showSnackbar('Błąd podczas edycji ucznia.', 'error');
                    },
                }
            );
        }
    };

    if (isLoading) return <Typography>Ładowanie klas...</Typography>;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {mode === 'create' ? 'Dodaj ucznia' : 'Edytuj ucznia'}
            </Typography>

            <TextField
                label="Imię"
                name="firstName"
                fullWidth
                margin="normal"
                value={formValues.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
            />
            <TextField
                label="Nazwisko"
                name="lastName"
                fullWidth
                margin="normal"
                value={formValues.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
            />

            <TextField
                label="Godzina przyjścia"
                name="arrivalTime"
                type="time"
                fullWidth
                margin="normal"
                value={formValues.arrivalTime || ''}
                onChange={handleChange}
            />

            <TextField
                label="Godzina wyjścia"
                name="departureTime"
                type="time"
                fullWidth
                margin="normal"
                value={formValues.departureTime || ''}
                onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" error={!!errors.studentClassId}>
                <InputLabel>Klasa</InputLabel>
                <Select
                    value={formValues.studentClassId || ''}
                    onChange={(e) => handleSelectChange(Number(e.target.value))}
                >
                    {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                            {cls.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.studentClassId && (
                    <Typography color="error">{errors.studentClassId}</Typography>
                )}
            </FormControl>

            <Box sx={styles.buttonBox}>
                <Button variant="contained" onClick={handleSubmit} sx={styles.button}>
                    {mode === 'create' ? 'Zapisz' : 'Aktualizuj'}
                </Button>
            </Box>
        </>
    );
};
