-- StudentClass
INSERT INTO student_class (name, department) VALUES
('1A', 'ZRW'),
('2B', 'ZRW');

-- Student
INSERT INTO student (first_name, last_name, arrival_time, departure_time, student_class_id) VALUES
('Jan', 'Kowalski', '08:00:00', '14:00:00', 1),
('Anna', 'Nowak', '08:15:00', '14:15:00', 2);

-- Therapist
INSERT INTO therapist (first_name, last_name, role) VALUES
('Marek', 'Nowicki', 'PSYCHOLOGIST'),
('Ewa', 'Kowal', 'SPEECH_THERAPIST');

-- Therapist Departments (many-to-many)
INSERT INTO therapist_departments (therapist_id, department) VALUES
(1, 'ZRW'),
(2, 'DEPT_1'),
(2, 'DEPT_2');

-- Room
INSERT INTO room (name) VALUES
('Sala 101'),
('Sala 102'),
('Sala 103'),
('Sala 104'),
('Sala 105');

-- ScheduleSlot
INSERT INTO schedule_slot (title, start_time, end_time, therapist_id, room_id, day_of_week, is_individual, student_class_id) VALUES
('Testowe zajęcia', '09:00:00', '10:00:00', 1, 1, 'MONDAY', true, NULL);

-- ScheduleSlot -> Students (many-to-many)
INSERT INTO schedule_slot_students (schedule_slot_id, student_id) VALUES
(1, 1),
(1, 2);


SELECT setval('student_class_id_seq', (SELECT MAX(id) FROM student_class));
SELECT setval('student_id_seq', (SELECT MAX(id) FROM student));
SELECT setval('therapist_id_seq', (SELECT MAX(id) FROM therapist));
SELECT setval('room_id_seq', (SELECT MAX(id) FROM room));
SELECT setval('schedule_slot_id_seq', (SELECT MAX(id) FROM schedule_slot));
