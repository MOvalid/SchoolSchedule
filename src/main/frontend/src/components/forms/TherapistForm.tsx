import React, { useState, useEffect } from 'react';
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
    SxProps,
    Theme,
} from '@mui/material';
import { Department, DepartmentLabels } from '../../types/enums/department';
import { TherapistRole, TherapistRoleLabels } from '../../types/enums/therapistRole';
import { useCreateTherapist, useUpdateTherapist } from '../../hooks/useTherapists';
import { useSnackbar } from '../../context/SnackbarContext';
import { TherapistDto } from '../../types/types';

const departments = Object.values(Department);
const therapistRoles = Object.values(TherapistRole);

interface Props {
    mode?: 'create' | 'edit';
    initialData?: TherapistDto;
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

const TherapistForm: React.FC<Props> = ({ mode = 'create', initialData, onSuccess }) => {
    const snackbar = useSnackbar();
    const createTherapist = useCreateTherapist();
    const updateTherapist = useUpdateTherapist();

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        departments: [] as Department[],
        role: '' as TherapistRole | '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormValues({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                departments: initialData.departments ?? [],
                role: initialData.role ?? '',
            });
        }
    }, [mode, initialData]);

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

        if (mode === 'create') {
            createTherapist.mutate(formValues, {
                onSuccess: () => {
                    snackbar.showSnackbar('Terapeuta został dodany pomyślnie!', 'success');
                    setFormValues({ firstName: '', lastName: '', departments: [], role: '' });
                    onSuccess?.();
                },
                onError: () => {
                    snackbar.showSnackbar('Błąd podczas dodawania terapeuty.', 'error');
                },
            });
        } else if (mode === 'edit' && initialData) {
            updateTherapist.mutate(
                {
                    id: initialData.id,
                    data: {
                        id: initialData.id,
                        firstName: formValues.firstName,
                        lastName: formValues.lastName,
                        departments: formValues.departments,
                        role: formValues.role as TherapistRole,
                    },
                },
                {
                    onSuccess: () => {
                        snackbar.showSnackbar(
                            'Terapeuta został zaktualizowany pomyślnie!',
                            'success'
                        );
                        onSuccess?.();
                    },
                    onError: () => {
                        snackbar.showSnackbar('Błąd podczas edycji terapeuty.', 'error');
                    },
                }
            );
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {mode === 'create' ? 'Dodaj terapeutę' : 'Edytuj terapeutę'}
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
                    onChange={(e) => handleSelectChange('role', e.target.value as TherapistRole)}
                >
                    {therapistRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {TherapistRoleLabels[role]}
                        </MenuItem>
                    ))}
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            <Box sx={styles.buttonBox}>
                <Button variant="contained" onClick={handleSubmit} sx={styles.button}>
                    {mode === 'create' ? 'Zapisz' : 'Aktualizuj'}
                </Button>
            </Box>
        </>
    );
};

export default TherapistForm;
