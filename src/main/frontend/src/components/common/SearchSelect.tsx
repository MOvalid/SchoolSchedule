import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface SearchSelectProps {
    label: string;
    items: { id: number; label: string }[];
    value: number | null;
    onChange: (value: number | null) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({ label, items, value, onChange }) => {
    const selectedOption = items.find((item) => item.id === value) || null;

    return (
        <Autocomplete
            options={items}
            getOptionLabel={(option) => option.label}
            value={selectedOption}
            onChange={(_, newValue) => onChange(newValue ? newValue.id : null)}
            renderInput={(params) => <TextField {...params} label={label} fullWidth />}
            isOptionEqualToValue={(option, val) => option.id === val.id}
        />
    );
};

export default SearchSelect;
