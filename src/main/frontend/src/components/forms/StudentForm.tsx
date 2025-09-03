import React, { useEffect } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useFormHandler } from '../../hooks/useFormHandler';
import { FormHeader } from './FormHeader';
import { FormSubmitButton } from './FormSubmitButton';
import { useCreateStudent, useUpdateStudent } from '../../hooks/useStudents';
import { CreateStudentDto, StudentDto } from '../../types/types';
import { useStudentClasses } from '../../hooks/useStudentClasses';
import { Spinner } from '../common/Spinner';

interface StudentFormProps {
    mode: 'create' | 'edit';
    initialData?: StudentDto;
    onSuccess?: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ mode, initialData, onSuccess }) => {
    const { data: classes = [], isLoading: isClassLoading } = useStudentClasses();

    const {
        formValues,
        errors,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isLoading: isFormLoading,
    } = useFormHandler<CreateStudentDto, StudentDto>({
        mode,
        initialValues: {
            firstName: '',
            lastName: '',
            studentClassId: undefined,
            arrivalTime: '',
            departureTime: '',
        } as StudentDto,
        initialData,
        validate: (values: StudentDto) => {
            const errors: Record<string, string> = {};

            if (!values.firstName.trim()) errors.firstName = 'Wymagane imię';
            if (!values.lastName.trim()) errors.lastName = 'Wymagane nazwisko';
            if (!values.studentClassId) errors.studentClassId = 'Wymagana klasa ucznia';

            const arrival = values.arrivalTime?.trim() || '00:00';
            const departure = values.departureTime?.trim() || '23:59';

            if (arrival > departure) {
                errors.arrivalTime =
                    'Godzina przyjścia nie może być późniejsza niż godzina wyjścia';
                errors.departureTime =
                    'Godzina wyjścia nie może być wcześniejsza niż godzina przyjścia';
            }

            return errors;
        },
        createMutationFn: useCreateStudent,
        updateMutationFn: useUpdateStudent,
        successMessages: {
            create: 'Uczeń został dodany pomyślnie!',
            update: 'Uczeń został zaktualizowany pomyślnie!',
        },
        errorMessages: {
            create: 'Błąd podczas dodawania ucznia.',
            update: 'Błąd podczas edycji ucznia.',
        },
        onSuccess,
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
        setIsLoading(isClassLoading || isFormLoading);
    }, [isClassLoading, isFormLoading]);

    if (isLoading) return <Spinner fullScreen={true} />;

    return (
        <>
            <FormHeader mode={mode} entityName="ucznia" />

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

            <FormControl fullWidth margin="normal" error={!!errors.studentClassId}>
                <InputLabel id="studentClassId-label">Klasa</InputLabel>
                <Select
                    labelId="studentClassId-label"
                    value={formValues.studentClassId ?? ''}
                    onChange={(e) => handleSelectChange('studentClassId', e.target.value)}
                >
                    {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                            {cls.name}
                        </MenuItem>
                    ))}
                </Select>
                {errors.studentClassId && (
                    <span style={{ color: 'red', fontSize: '0.8rem' }}>
                        {errors.studentClassId}
                    </span>
                )}
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Godzina przyjścia"
                name="arrivalTime"
                type="time"
                value={formValues.arrivalTime}
                onChange={handleChange}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
                error={!!errors.arrivalTime}
                helperText={errors.arrivalTime}
            />

            <TextField
                fullWidth
                margin="normal"
                label="Godzina wyjścia"
                name="departureTime"
                type="time"
                value={formValues.departureTime}
                onChange={handleChange}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
                error={!!errors.departureTime}
                helperText={errors.departureTime}
            />

            <FormSubmitButton mode={mode} onClick={handleSubmit} />
        </>
    );
};
