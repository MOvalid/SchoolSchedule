import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchSelect from '../common/SearchSelect';
import { EntityTypes } from '../../types/enums/entityTypes';
import { StudentDto, TherapistDto, StudentClassDto } from '../../types/types';
import { getAllStudents } from '../../services/StudentService';
import { getAllTherapists } from '../../services/TherapistService';
import { getAllClasses } from '../../services/StudentClassService';

interface EntityOption {
    id: number;
    label: string;
}

interface Props {
    entityType: EntityTypes;
}

const EntitySearchPage: React.FC<Props> = ({ entityType }) => {
    const [options, setOptions] = useState<EntityOption[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();

    const labels = useMemo(() => {
        switch (entityType) {
            case EntityTypes.Student:
                return { title: 'Wyszukaj ucznia', label: 'Uczeń' };
            case EntityTypes.Therapist:
                return { title: 'Wyszukaj terapeutę', label: 'Terapeuta' };
            case EntityTypes.Class:
                return { title: 'Wyszukaj klasę', label: 'Klasa' };
            default:
                return { title: '', label: '' };
        }
    }, [entityType]);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                switch (entityType) {
                    case EntityTypes.Student: {
                        const data = (await getAllStudents()).data as StudentDto[];
                        setOptions(
                            data.map((s) => ({
                                id: s.id!,
                                label: `${s.firstName} ${s.lastName}`,
                            }))
                        );
                        break;
                    }
                    case EntityTypes.Therapist: {
                        const data = (await getAllTherapists()).data as TherapistDto[];
                        setOptions(
                            data.map((t) => ({
                                id: t.id!,
                                label: `${t.firstName} ${t.lastName}`,
                            }))
                        );
                        break;
                    }
                    case EntityTypes.Class: {
                        const data = (await getAllClasses()).data as StudentClassDto[];
                        setOptions(
                            data.map((c) => ({
                                id: c.id!,
                                label: `Grupa ${c.name}`,
                            }))
                        );
                        break;
                    }
                    default:
                        setOptions([]);
                }
            } catch (err) {
                console.error('Błąd pobierania danych:', err);
            }
        };
        fetchEntities();
    }, [entityType]);

    const handleSelect = (id: number | null) => {
        setSelectedId(id);
        if (id !== null) {
            const entity = options.find((o) => o.id === id);
            if (!entity) return;

            navigate(`/schedule/${entityType.toLowerCase()}/${id}`, {
                state: {
                    name: entity.label,
                    entityId: id,
                    entityType,
                },
            });
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                {labels.title}
            </Typography>
            <SearchSelect
                label={labels.label}
                items={options}
                value={selectedId}
                onChange={(val) => handleSelect(val as number | null)}
                multiple={false}
            />
        </Box>
    );
};

export default EntitySearchPage;
