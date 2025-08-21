package com.MSPDiON.SchoolSchedule.repository;

import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {

    List<ScheduleSlot> findByTherapistId(Long therapistId);
    List<ScheduleSlot> findByStudents_Id(Long studentId);
    List<ScheduleSlot> findByStudentClass_Id(Long classId);

    @Query("""
        SELECT s FROM ScheduleSlot s
        WHERE s.therapist.id = :therapistId
        AND s.startTime < :endTime AND s.endTime > :startTime
    """)
    List<ScheduleSlot> findConflictsByTherapist(Long therapistId, LocalTime startTime, LocalTime endTime);

    @Query("""
        SELECT s FROM ScheduleSlot s
        WHERE s.room.id = :roomId
        AND s.startTime < :endTime AND s.endTime > :startTime
    """)
    List<ScheduleSlot> findConflictsByRoom(Long roomId, LocalTime startTime, LocalTime endTime);

    @Query("""
        SELECT s FROM ScheduleSlot s
        JOIN s.students st
        WHERE st.id = :studentId
        AND s.startTime < :endTime AND s.endTime > :startTime
    """)
    List<ScheduleSlot> findConflictsByStudent(Long studentId, LocalTime startTime, LocalTime endTime);
}
