import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useCreateStudent } from '../../hooks/useStudents';
import { useStudentClasses } from '../../hooks/useStudentClasses';
import { CreateStudentDto } from '../../types/types';
import { useSnackbar } from '../../context/SnackbarContext';

interface Props {
    onSuccess?: () => void;
}

export const StudentForm: React.FC<Props> = ({ onSuccess }) => {
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
    const { data: classes = [], isLoading } = useStudentClasses();

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
    };

    if (isLoading) return <Typography>Ładowanie klas...</Typography>;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Dodaj ucznia
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit} sx={{ width: '40%' }}>
                    Zapisz
                </Button>
            </Box>
        </>
    );
};
