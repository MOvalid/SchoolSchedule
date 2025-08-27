import React, { useState } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Button,
    Box,
    FormHelperText,
    Typography,
} from '@mui/material';
import { Department, DepartmentLabels } from '../../types/enums/department';
import { TherapistRole, TherapistRoleLabels } from '../../types/enums/therapistRole';
import { useCreateTherapist } from '../../hooks/useTherapists';
import { useSnackbar } from '../../context/SnackbarContext';

const departments = Object.values(Department);
const therapistRoles = Object.values(TherapistRole);

const TherapistForm: React.FC = () => {
    const snackbar = useSnackbar();
    const createTherapist = useCreateTherapist();

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        departments: [] as Department[],
        role: '' as TherapistRole | '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        if (value.trim()) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSelectChange = (
        name: 'departments' | 'role',
        value: Department[] | TherapistRole
    ) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));

        if (
            (name === 'departments' && Array.isArray(value) && value.length > 0) ||
            (name === 'role' && value)
        ) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formValues.firstName.trim()) newErrors.firstName = 'Imię jest wymagane';
        if (!formValues.lastName.trim()) newErrors.lastName = 'Nazwisko jest wymagane';
        if (!formValues.departments.length)
            newErrors.departments = 'Wybierz przynajmniej jeden oddział';
        if (!formValues.role) newErrors.role = 'Rola jest wymagana';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        createTherapist.mutate(formValues, {
            onSuccess: () => {
                snackbar.showSnackbar('Terapeuta został dodany pomyślnie!', 'success');
                setFormValues({ firstName: '', lastName: '', departments: [], role: '' });
            },
            onError: () => {
                snackbar.showSnackbar('Błąd podczas dodawania terapeuty.', 'error');
            },
        });
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Dodaj terapeutę
            </Typography>

            <TextField
                fullWidth
                margin="normal"
                label="Imię"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Nazwisko"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
            />

            <FormControl fullWidth margin="normal" error={!!errors.departments}>
                <InputLabel id="dept-multi-select-label">Oddziały</InputLabel>
                <Select
                    labelId="dept-multi-select-label"
                    multiple
                    value={formValues.departments}
                    onChange={(e) =>
                        handleSelectChange('departments', e.target.value as Department[])
                    }
                    input={<OutlinedInput label="Oddziały" />}
                    renderValue={(selected) =>
                        (selected as Department[]).map((d) => DepartmentLabels[d]).join(', ')
                    }
                >
                    {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                            <Checkbox checked={formValues.departments.includes(dept)} />
                            <ListItemText primary={DepartmentLabels[dept]} />
                        </MenuItem>
                    ))}
                </Select>
                {errors.departments && <FormHelperText>{errors.departments}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel id="role-select-label">Rola</InputLabel>
                <Select
                    labelId="role-select-label"
                    value={formValues.role}
                    onChange={(e) => handleSelectChange('role', e.target.value)}
                >
                    {therapistRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {TherapistRoleLabels[role]}
                        </MenuItem>
                    ))}
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit} sx={{ width: '40%' }}>
                    Zapisz
                </Button>
            </Box>
        </>
    );
};

export default TherapistForm;
