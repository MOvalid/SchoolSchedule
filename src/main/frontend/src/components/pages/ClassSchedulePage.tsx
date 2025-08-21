import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchSelect from '../common/SearchSelect';
import ScheduleList from '../common/ScheduleList';
import { getAllClasses } from '../../services/StudentClassService';
import { getScheduleForClass } from '../../services/ScheduleService';
import { StudentClassDto, ScheduleSlotDto } from '../../types/types';

const ClassSchedulePage: React.FC = () => {
    const [classes, setClasses] = useState<StudentClassDto[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [schedule, setSchedule] = useState<ScheduleSlotDto[]>([]);

    useEffect(() => {
        getAllClasses().then((res) => setClasses(res.data));
    }, []);

    useEffect(() => {
        if (selectedId !== null) {
            getScheduleForClass(selectedId).then((res) => setSchedule(res.data));
        }
    }, [selectedId]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Wyszukaj klasę
            </Typography>
            <SearchSelect
                label="Klasa"
                items={classes.map((cls) => ({
                    id: cls.id!,
                    label: cls.name,
                }))}
                value={selectedId}
                onChange={setSelectedId}
            />
            <ScheduleList slots={schedule} />
        </Box>
    );
};

export default ClassSchedulePage;
