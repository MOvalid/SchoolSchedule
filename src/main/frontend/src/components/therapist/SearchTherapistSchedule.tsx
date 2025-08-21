import React, { useEffect, useState } from 'react';
import { TherapistDto, ScheduleSlotDto } from '../../types/types';
import { getAllTherapists } from '../../services/TherapistService';
import { getScheduleForTherapist } from '../../services/ScheduleService';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel, Paper, List, ListItem, ListItemText
} from '@mui/material';

const SearchTherapistSchedule: React.FC = () => {
  const [therapists, setTherapists] = useState<TherapistDto[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [schedule, setSchedule] = useState<ScheduleSlotDto[]>([]);

  useEffect(() => {
    getAllTherapists().then((res) => setTherapists(res.data));
  }, []);

  useEffect(() => {
    if (selectedId !== '') {
      getScheduleForTherapist(selectedId).then((res) => setSchedule(res.data));
    }
  }, [selectedId]);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>Wyszukaj terapeutę</Typography>
      <FormControl fullWidth>
        <InputLabel id="therapist-label">Terapeuta</InputLabel>
        <Select
          labelId="therapist-label"
          value={selectedId}
          label="Terapeuta"
          onChange={(e) => setSelectedId(e.target.value as number)}
        >
          {therapists.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.firstName} {t.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {schedule.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Grafik terapeuty</Typography>
          <List>
            {schedule.map((slot) => (
              <Paper key={slot.id} sx={{ mb: 2, p: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={`Dzień: ${slot.dayOfWeek}, ${slot.startTime}–${slot.endTime}`}
                    secondary={
                      <>
                        Sala: {slot.room?.name || '–'}, Klasa: {slot.studentClass?.name || '–'}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SearchTherapistSchedule;
