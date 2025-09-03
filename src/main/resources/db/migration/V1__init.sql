CREATE TABLE student_class (
                               id SERIAL PRIMARY KEY,
                               name VARCHAR(100) NOT NULL UNIQUE,
                               department VARCHAR(50) NOT NULL
);

CREATE TABLE student (
                         id SERIAL PRIMARY KEY,
                         first_name VARCHAR(100),
                         last_name VARCHAR(100),
                         arrival_time TIME,
                         departure_time TIME,
                         student_class_id INT REFERENCES student_class(id) ON DELETE SET NULL
);

CREATE TABLE therapist (
                           id SERIAL PRIMARY KEY,
                           first_name VARCHAR(100),
                           last_name VARCHAR(100),
                           role VARCHAR(50)
);

CREATE TABLE therapist_departments (
                                       therapist_id INT NOT NULL REFERENCES therapist(id) ON DELETE CASCADE,
                                       department VARCHAR(50) NOT NULL,
                                       PRIMARY KEY (therapist_id, department)
);

CREATE TABLE room (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(100)
);

CREATE TABLE schedule_slot (
                               id SERIAL PRIMARY KEY,
                               title VARCHAR(255),
                               therapist_id INT NOT NULL REFERENCES therapist(id),
                               room_id INT NOT NULL REFERENCES room(id),
                               start_time TIME NOT NULL,
                               end_time TIME NOT NULL,
                               day_of_week VARCHAR(10) NOT NULL,
                               is_individual BOOLEAN NOT NULL,
                               student_class_id INT REFERENCES student_class(id)
);

CREATE TABLE schedule_slot_students (
                                        schedule_slot_id INT NOT NULL REFERENCES schedule_slot(id) ON DELETE CASCADE,
                                        student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
                                        PRIMARY KEY (schedule_slot_id, student_id)
);
