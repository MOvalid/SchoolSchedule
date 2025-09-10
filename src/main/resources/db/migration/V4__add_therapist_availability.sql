CREATE TABLE therapist_availability (
                                        id SERIAL PRIMARY KEY,
                                        therapist_id INT NOT NULL REFERENCES therapist(id) ON DELETE CASCADE,
                                        day_of_week INT NOT NULL,
                                        start_time TIME NOT NULL,
                                        end_time TIME NOT NULL,
                                        CONSTRAINT chk_time CHECK (start_time < end_time)
);


INSERT INTO therapist_availability (therapist_id, day_of_week, start_time, end_time) VALUES
(1, 1, '09:00', '14:00'),
(1, 4, '09:00', '14:00'),

(2, 2, '09:00', '13:00'),
(2, 5, '09:00', '13:00');

SELECT setval('therapist_availability_id_seq', (SELECT MAX(id) FROM therapist_availability));
