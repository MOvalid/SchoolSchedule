import React, { useState } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    FormHelperText,
    Typography,
} from '@mui/material';
import { Department, DepartmentLabels } from '../../types/enums/department';
import { useCreateClass } from '../../hooks/useStudentClasses';
import { useSnackbar } from '../../context/SnackbarContext';

const departments = Object.values(Department);

const ClassForm: React.FC = () => {
    const snackbar = useSnackbar();
    const createClass = useCreateClass();

    const [formValues, setFormValues] = useState<{ name: string; department?: Department }>({
        name: '',
        department: undefined,
    });
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        if (value.trim()) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formValues.name.trim()) newErrors.name = 'Nazwa klasy jest wymagana';
        if (!formValues.department) newErrors.department = 'Oddział jest wymagany';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        createClass.mutate(
            { name: formValues.name, department: formValues.department },
            {
                onSuccess: () => {
                    snackbar.showSnackbar('Klasa została dodana pomyślnie!', 'success');
                    setFormValues({ name: '', department: undefined });
                },
                onError: () => {
                    snackbar.showSnackbar('Błąd podczas dodawania klasy.', 'error');
                },
            }
        );
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Dodaj klasę
            </Typography>

            <TextField
                fullWidth
                margin="normal"
                label="Nazwa klasy"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
            />

            <FormControl fullWidth margin="normal" error={!!errors.department}>
                <InputLabel>Oddział</InputLabel>
                <Select
                    value={formValues.department ?? ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFormValues({
                            ...formValues,
                            department: value ? (value as Department) : undefined,
                        });
                        if (value) setErrors((prev) => ({ ...prev, department: undefined }));
                    }}
                >
                    {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                            {DepartmentLabels[dept]}
                        </MenuItem>
                    ))}
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit} sx={{ width: '40%' }}>
                    Zapisz
                </Button>
            </Box>
        </>
    );
};

export default ClassForm;
