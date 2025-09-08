import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface SearchSelectProps {
    label: string;
    items: { id: number; label: string }[];
    value: number | number[] | null;
    onChange: (value: number | number[] | null) => void;
    multiple?: boolean;
    error?: boolean;
    helperText?: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
    label,
    items,
    value,
    onChange,
    multiple = false,
    error = false,
    helperText = '',
}) => {
    const getOptionLabel = (option: { id: number; label: string }) => option.label;

    const isOptionEqualToValue = (
        option: { id: number; label: string },
        val: { id: number; label: string }
    ) => option.id === val.id;

    const selectedOption = multiple
        ? items.filter((item) => (value as number[] | null)?.includes(item.id) ?? false)
        : items.find((item) => item.id === (value as number | null)) || null;

    const handleChange = (
        _: React.SyntheticEvent,
        newValue: { id: number; label: string } | { id: number; label: string }[] | null
    ) => {
        if (multiple) {
            onChange((newValue as { id: number }[]).map((v) => v.id));
        } else {
            onChange((newValue as { id: number } | null)?.id ?? null);
        }
    };

    return (
        <Autocomplete
            multiple={multiple}
            options={items}
            getOptionLabel={getOptionLabel}
            value={selectedOption}
            onChange={handleChange}
            isOptionEqualToValue={isOptionEqualToValue}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    fullWidth
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
};

export default SearchSelect;
