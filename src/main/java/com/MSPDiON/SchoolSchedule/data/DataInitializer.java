package com.MSPDiON.SchoolSchedule.data;

import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalTime;
import java.util.List;

@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StudentRepository studentRepository,
                                   StudentClassRepository classRepository) {
        return args -> {
            studentRepository.deleteAll();
            classRepository.deleteAll();

            StudentClass class1A = new StudentClass();
            class1A.setName("1A");
            StudentClass class2B = new StudentClass();
            class2B.setName("2B");
            classRepository.saveAll(List.of(class1A, class2B));

            Student student1 = Student.builder()
                    .firstName("Jan")
                    .lastName("Kowalski")
                    .arrivalTime(LocalTime.of(8, 0))
                    .departureTime(LocalTime.of(14, 0))
                    .studentClass(class1A)
                    .build();

            Student student2 = Student.builder()
                    .firstName("Anna")
                    .lastName("Nowak")
                    .arrivalTime(LocalTime.of(8, 15))
                    .departureTime(LocalTime.of(14, 15))
                    .studentClass(class2B)
                    .build();

            studentRepository.saveAll(List.of(student1, student2));

            log.info("Database initialized with mock data.");
        };
    }
}
