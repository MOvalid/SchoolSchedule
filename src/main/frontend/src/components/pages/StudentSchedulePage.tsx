import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchSelect from '../common/SearchSelect';
import { StudentDto } from '../../types/types';
import { mockStudents } from '../../mock/mockStudents';
import { mockSchedule } from '../../mock/mockSchedule';

const StudentSchedulePage: React.FC = () => {
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Zamiast pobierania z API, używamy mocków
    setStudents(mockStudents);
  }, []);

  const handleSelect = (id: number | null) => {
    setSelectedId(id);
    if (id !== null) {
      const student = students.find(s => s.id === id);
      if (!student) return;

      navigate(`/schedule/student/${id}`, {
        state: {
          name: `${student.firstName} ${student.lastName}`,
        },
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Wyszukaj ucznia</Typography>
      <SearchSelect
        label="Uczeń"
        items={students.map(s => ({
          id: s.id!,
          label: `${s.firstName} ${s.lastName}`,
        }))}
        value={selectedId}
        onChange={handleSelect}
      />
    </Box>
  );
};

export default StudentSchedulePage;
