package com.MSPDiON.SchoolSchedule.data;

import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.Room;
import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.model.TherapistRole;
import com.MSPDiON.SchoolSchedule.repository.RoomRepository;
import com.MSPDiON.SchoolSchedule.repository.ScheduleSlotRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentClassRepository;
import com.MSPDiON.SchoolSchedule.repository.StudentRepository;
import com.MSPDiON.SchoolSchedule.repository.TherapistRepository;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner initDatabase(
      StudentRepository studentRepository,
      StudentClassRepository classRepository,
      TherapistRepository therapistRepository,
      RoomRepository roomRepository,
      ScheduleSlotRepository scheduleSlotRepository) {
    return args -> {
      scheduleSlotRepository.deleteAll();
      studentRepository.deleteAll();
      classRepository.deleteAll();
      therapistRepository.deleteAll();
      roomRepository.deleteAll();

      StudentClass class1A = new StudentClass();
      class1A.setName("1A");
      class1A.setDepartment(Department.ZRW);

      StudentClass class2B = new StudentClass();
      class2B.setName("2B");
      class2B.setDepartment(Department.ZRW);

      classRepository.saveAll(List.of(class1A, class2B));

      Student student1 =
          Student.builder()
              .firstName("Jan")
              .lastName("Kowalski")
              .arrivalTime(LocalTime.of(8, 0))
              .departureTime(LocalTime.of(14, 0))
              .studentClass(class1A)
              .build();

      Student student2 =
          Student.builder()
              .firstName("Anna")
              .lastName("Nowak")
              .arrivalTime(LocalTime.of(8, 15))
              .departureTime(LocalTime.of(14, 15))
              .studentClass(class2B)
              .build();

      studentRepository.saveAll(List.of(student1, student2));

      Therapist therapist1 =
          Therapist.builder()
              .firstName("Marek")
              .lastName("Nowicki")
              .role(TherapistRole.PSYCHOLOGIST)
              .departments(List.of(Department.ZRW))
              .build();

      Therapist therapist2 =
          Therapist.builder()
              .firstName("Ewa")
              .lastName("Kowal")
              .role(TherapistRole.SPEECH_THERAPIST)
              .departments(List.of(Department.DEPT_1, Department.DEPT_2))
              .build();

      therapistRepository.saveAll(List.of(therapist1, therapist2));

      Room room1 = new Room();
      room1.setName("Sala 101");
      Room room2 = new Room();
      room2.setName("Sala 102");
      Room room3 = new Room();
      room3.setName("Sala 103");
      Room room4 = new Room();
      room4.setName("Sala 104");
      Room room5 = new Room();
      room5.setName("Sala 105");

      roomRepository.saveAll(List.of(room1, room2, room3, room4, room5));

      ScheduleSlot slot1 =
          ScheduleSlot.builder()
              .dayOfWeek(java.time.DayOfWeek.MONDAY)
              .title("Testowe zajęcia")
              .startTime(LocalTime.of(6, 0))
              .endTime(LocalTime.of(7, 0))
              .therapist(therapist1)
              .room(room1)
              .isIndividual(true)
              .students(Set.of(student1, student2))
              .build();

      scheduleSlotRepository.saveAll(List.of(slot1));

      log.info("Database initialized with mock data.");
    };
  }
}
