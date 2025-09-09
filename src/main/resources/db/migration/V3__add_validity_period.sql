ALTER TABLE schedule_slot
    ADD COLUMN valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    ADD COLUMN valid_to DATE;

UPDATE schedule_slot
SET valid_from = CURRENT_DATE
WHERE valid_from IS NULL;

SELECT setval('schedule_slot_id_seq', (SELECT MAX(id) FROM schedule_slot));

INSERT INTO schedule_slot (title, start_time, end_time, therapist_id, room_id, day_of_week, is_individual, student_class_id, valid_from, valid_to)
VALUES ('Slot bezterminowy', '11:00:00', '12:00:00', 1, 2, 'TUESDAY', true, NULL, CURRENT_DATE, NULL);
