CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    entity_id INT NOT NULL,
    entity_type VARCHAR(20) NOT NULL,
    day_of_week INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT chk_time CHECK (start_time < end_time)
);

INSERT INTO availability (entity_id, entity_type, day_of_week, start_time, end_time)
SELECT therapist_id, 'therapist', day_of_week, start_time, end_time
FROM therapist_availability;

CREATE SEQUENCE availability_id_seq;
SELECT setval('availability_id_seq', (SELECT MAX(id) FROM availability));

DROP TABLE therapist_availability;
DROP SEQUENCE IF EXISTS therapist_availability_id_seq;

CREATE INDEX idx_availability_entity ON availability(entity_id, entity_type);
