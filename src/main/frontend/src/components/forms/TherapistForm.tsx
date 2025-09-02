import React, { useEffect, useState } from 'react';
import {
    Box,
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SxProps,
    TextField,
    Theme,
} from '@mui/material';
import { useFormHandler } from '../../hooks/useFormHandler';
import { FormHeader } from './FormHeader';
import { FormSubmitButton } from './FormSubmitButton';
import { useCreateTherapist, useUpdateTherapist } from '../../hooks/useTherapists';
import { Department, DepartmentLabels } from '../../types/enums/department';
import { TherapistRole, TherapistRoleLabels } from '../../types/enums/therapistRole';
import { CreateTherapistDto, TherapistDto } from '../../types/types';
import { Spinner } from '../common/Spinner';

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

const DEPARTMENTS = Object.values(Department);
const THERAPIST_ROLES = Object.values(TherapistRole);

interface TherapistFormProps {
    mode: 'create' | 'edit';
    initialData?: TherapistDto;
    onSuccess?: () => void;
}

const TherapistForm: React.FC<TherapistFormProps> = ({ mode, initialData, onSuccess }) => {
    const {
        formValues,
        errors,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isLoading: isFormLoading,
    } = useFormHandler<CreateTherapistDto, TherapistDto>({
        mode,
        initialValues: {
            firstName: '',
            lastName: '',
            departments: [] as Department[],
            role: TherapistRole.Psychologist as TherapistRole,
        } as TherapistDto,
        initialData,
        validate: (values: TherapistDto) => {
            const errors: Record<string, string> = {};
            if (!values.firstName.trim()) errors.firstName = 'Wymagane imię';
            if (!values.lastName.trim()) errors.lastName = 'Wymagane nazwisko';
            if (!values.departments || !values.departments.length)
                errors.departments = 'Wybierz przynajmniej jeden oddział';
            if (!values.role) errors.role = 'Wymagana rola terapeuty';
            return errors;
        },
        createMutationFn: useCreateTherapist,
        updateMutationFn: useUpdateTherapist,
        successMessages: {
            create: 'Terapeuta został dodany pomyślnie!',
            update: 'Terapeuta został zaktualizowany pomyślnie!',
        },
        errorMessages: {
            create: 'Błąd podczas dodawania terapeuty.',
            update: 'Błąd podczas edycji terapeuty.',
        },
        onSuccess,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(isFormLoading);
    }, [isFormLoading]);

    if (isLoading) return <Spinner fullScreen />;

    return (
        <>
            <FormHeader mode={mode} entityName="terapeutę" />

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
                    value={formValues.departments ?? []}
                    onChange={(e) =>
                        handleSelectChange('departments', e.target.value as Department[])
                    }
                    input={<OutlinedInput label="Oddziały" />}
                    renderValue={(selected) =>
                        (selected as Department[]).map((d) => DepartmentLabels[d]).join(', ')
                    }
                >
                    {DEPARTMENTS.map((dept) => (
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
                    {THERAPIST_ROLES.map((role) => (
                        <MenuItem key={role} value={role}>
                            {TherapistRoleLabels[role]}
                        </MenuItem>
                    ))}
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>

            <Box sx={styles.buttonBox}>
                <FormSubmitButton mode={mode} onClick={handleSubmit} />
            </Box>
        </>
    );
};

export default TherapistForm;
