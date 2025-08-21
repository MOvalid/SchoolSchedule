import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchSelect from '../common/SearchSelect';
import ScheduleList from '../common/ScheduleList';
import { getAllTherapists } from '../../services/TherapistService';
import { getScheduleForTherapist } from '../../services/ScheduleService';
import { TherapistDto, ScheduleSlotDto } from '../../types/types';

const TherapistSchedulePage: React.FC = () => {
    const [therapists, setTherapists] = useState<TherapistDto[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [schedule, setSchedule] = useState<ScheduleSlotDto[]>([]);

    useEffect(() => {
        getAllTherapists().then((res) => setTherapists(res.data));
    }, []);

    useEffect(() => {
        if (selectedId !== null) {
            getScheduleForTherapist(selectedId).then((res) => setSchedule(res.data));
        }
    }, [selectedId]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Wyszukaj terapeutę
            </Typography>
            <SearchSelect
                label="Terapeuta"
                items={therapists.map((t) => ({
                    id: t.id!,
                    label: `${t.firstName} ${t.lastName}`,
                }))}
                value={selectedId}
                onChange={setSelectedId}
            />
            <ScheduleList slots={schedule} />
        </Box>
    );
};

export default TherapistSchedulePage;
