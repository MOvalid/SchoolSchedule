import React from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormHelperText,
    SxProps,
    Theme,
} from '@mui/material';
import { Department, DepartmentLabels } from '../../types/enums/department';
import { useCreateClass, useUpdateClass } from '../../hooks/useStudentClasses';
import { useFormHandler } from '../../hooks/useFormHandler';
import { FormHeader } from './FormHeader';
import { FormSubmitButton } from './FormSubmitButton';
import { StudentClassDto, CreateStudentClassDto } from '../../types/types';
import { Spinner } from '../common/Spinner';

interface Props {
    mode?: 'create' | 'edit';
    initialData?: StudentClassDto;
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
const DEPARTMENTS = Object.values(Department);

export const ClassForm: React.FC<Props> = ({ mode = 'create', initialData, onSuccess }) => {
    const {
        formValues,
        errors,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isLoading: isFormLoading,
    } = useFormHandler<CreateStudentClassDto, StudentClassDto>({
        mode,
        initialValues: {
            name: '',
            department: undefined,
        } as unknown as StudentClassDto,
        initialData,
        validate: (values: StudentClassDto) => {
            const errors: Record<string, string> = {};
            if (!values.name?.trim()) errors.name = 'Nazwa klasy jest wymagana';
            if (!values.department) errors.department = 'Oddział jest wymagany';
            return errors;
        },
        createMutationFn: useCreateClass,
        updateMutationFn: useUpdateClass,
        successMessages: {
            create: 'Klasa została dodana pomyślnie!',
            update: 'Klasa została zaktualizowana pomyślnie!',
        },
        errorMessages: {
            create: 'Błąd podczas dodawania klasy.',
            update: 'Błąd podczas edycji klasy.',
        },
        onSuccess,
    });

    if (isFormLoading) return <Spinner fullScreen />;

    return (
        <>
            <FormHeader mode={mode} entityName="klasę" />

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
                    onChange={(e) =>
                        handleSelectChange(
                            'department',
                            e.target.value ? (e.target.value as Department) : undefined
                        )
                    }
                >
                    {DEPARTMENTS.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                            {DepartmentLabels[dept]}
                        </MenuItem>
                    ))}
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
            </FormControl>

            <Box sx={styles.buttonBox}>
                <FormSubmitButton mode={mode} onClick={handleSubmit} />
            </Box>
        </>
    );
};

export default ClassForm;
