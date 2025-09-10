package com.MSPDiON.SchoolSchedule.data;

import com.MSPDiON.SchoolSchedule.model.Availability;
import com.MSPDiON.SchoolSchedule.model.Department;
import com.MSPDiON.SchoolSchedule.model.Room;
import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import com.MSPDiON.SchoolSchedule.model.Student;
import com.MSPDiON.SchoolSchedule.model.StudentClass;
import com.MSPDiON.SchoolSchedule.model.Therapist;
import com.MSPDiON.SchoolSchedule.model.TherapistRole;
import com.MSPDiON.SchoolSchedule.repository.AvailabilityRepository;
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
import org.springframework.context.annotation.Profile;

@Slf4j
@Configuration
@Profile("dev")
public class DataInitializer {

  @Bean
  CommandLineRunner initDatabase(
      StudentRepository studentRepository,
      StudentClassRepository classRepository,
      TherapistRepository therapistRepository,
      AvailabilityRepository availabilityRepository,
      RoomRepository roomRepository,
      ScheduleSlotRepository scheduleSlotRepository) {
    return args -> {
      scheduleSlotRepository.deleteAll();
      studentRepository.deleteAll();
      classRepository.deleteAll();
      therapistRepository.deleteAll();
      availabilityRepository.deleteAll();
      roomRepository.deleteAll();

      StudentClass class1A = new StudentClass();
      class1A.setName("1A");
      class1A.setDepartment(Department.ZRW);
      class1A.setStudents(List.of());

      StudentClass class2B = new StudentClass();
      class2B.setName("2B");
      class2B.setDepartment(Department.ZRW);
      class2B.setStudents(List.of());

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

      Availability t1Mon = new Availability();
      t1Mon.setEntityType("THERAPIST");
      t1Mon.setEntityId(therapist1.getId());
      t1Mon.setDayOfWeek(1);
      t1Mon.setStartTime(LocalTime.of(9, 0));
      t1Mon.setEndTime(LocalTime.of(14, 0));

      Availability t1Thu = new Availability();
      t1Thu.setEntityType("THERAPIST");
      t1Thu.setEntityId(therapist1.getId());
      t1Thu.setDayOfWeek(4);
      t1Thu.setStartTime(LocalTime.of(9, 0));
      t1Thu.setEndTime(LocalTime.of(14, 0));

      Availability t2Tue = new Availability();
      t2Tue.setEntityType("THERAPIST");
      t2Tue.setEntityId(therapist2.getId());
      t2Tue.setDayOfWeek(2);
      t2Tue.setStartTime(LocalTime.of(9, 0));
      t2Tue.setEndTime(LocalTime.of(13, 0));

      Availability t2Fri = new Availability();
      t2Fri.setEntityType("THERAPIST");
      t2Fri.setEntityId(therapist2.getId());
      t2Fri.setDayOfWeek(5);
      t2Fri.setStartTime(LocalTime.of(9, 0));
      t2Fri.setEndTime(LocalTime.of(13, 0));

      availabilityRepository.saveAll(List.of(t1Mon, t1Thu, t2Tue, t2Fri));

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
              .startTime(LocalTime.of(9, 0))
              .endTime(LocalTime.of(10, 0))
              .therapist(therapist1)
              .room(room1)
              .isIndividual(true)
              .students(Set.of(student1, student2))
              .validFrom(java.time.LocalDate.now())
              .validTo(null)
              .build();

      scheduleSlotRepository.saveAll(List.of(slot1));

      ScheduleSlot slot2 =
          ScheduleSlot.builder()
              .dayOfWeek(java.time.DayOfWeek.TUESDAY)
              .title("Slot z datą końcową")
              .startTime(LocalTime.of(11, 0))
              .endTime(LocalTime.of(12, 0))
              .therapist(therapist2)
              .room(room2)
              .isIndividual(true)
              .students(Set.of(student1))
              .validFrom(java.time.LocalDate.now())
              .validTo(java.time.LocalDate.now().plusMonths(3))
              .build();

      scheduleSlotRepository.save(slot2);

      log.info("Database initialized with mock data.");
    };
  }
}
