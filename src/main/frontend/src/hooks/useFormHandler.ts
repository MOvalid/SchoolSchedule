import { useEffect, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

type Mode = 'create' | 'edit';

interface UseFormHandlerProps<TCreateDto, TDto> {
    mode: Mode;
    initialValues: TDto;
    initialData?: Partial<TDto>;
    validate: (values: TDto) => Record<string, string>;
    createMutationFn: () => UseMutationResult<AxiosResponse<TDto>, unknown, TCreateDto>;
    updateMutationFn: () => UseMutationResult<
        AxiosResponse<TDto>,
        unknown,
        { id: number; data: TDto }
    >;
    successMessages: { create: string; update: string };
    errorMessages: { create: string; update: string };
    onSuccess?: () => void;
}

export const useFormHandler = <TCreateDto extends object, TDto>({
    mode,
    initialValues,
    initialData,
    validate,
    createMutationFn,
    updateMutationFn,
    successMessages,
    errorMessages,
    onSuccess,
}: UseFormHandlerProps<TCreateDto, TDto>) => {
    const [formValues, setFormValues] = useState<TDto>((initialData as TDto) ?? initialValues);
    const createMutation = createMutationFn();
    const updateMutation = updateMutationFn();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const snackbar = useSnackbar();

    useEffect(() => {
        setIsLoading(createMutation.isPending || updateMutation.isPending);
    }, [createMutation.isPending, updateMutation.isPending]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof TCreateDto, value: unknown) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const runValidation = (): boolean => {
        const newErrors = validate(formValues);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!runValidation()) return;

        const isCreate = mode === 'create';
        const successSnackbarMessage = isCreate ? successMessages.create : successMessages.update;
        const errorSnackbarMessage = isCreate ? errorMessages.create : errorMessages.update;

        if (isCreate) {
            createMutation.mutate(formValues as unknown as TCreateDto, {
                onSuccess: () => {
                    setFormValues(initialValues);
                    snackbar.showSnackbar(successSnackbarMessage, 'success');
                    onSuccess?.();
                },
                onError: () => {
                    snackbar.showSnackbar(errorSnackbarMessage, 'error');
                },
            });
        } else if (initialData && 'id' in initialData) {
            updateMutation.mutate(
                { id: initialData.id as number, data: formValues },
                {
                    onSuccess: () => {
                        snackbar.showSnackbar(successSnackbarMessage, 'success');
                        onSuccess?.();
                    },
                    onError: () => {
                        snackbar.showSnackbar(errorSnackbarMessage, 'error');
                    },
                }
            );
        }
    };

    return {
        formValues,
        setFormValues,
        errors,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isLoading,
    };
};
