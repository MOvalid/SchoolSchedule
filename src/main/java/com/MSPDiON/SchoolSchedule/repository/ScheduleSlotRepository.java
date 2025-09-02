package com.MSPDiON.SchoolSchedule.repository;

import com.MSPDiON.SchoolSchedule.model.ScheduleSlot;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {

  List<ScheduleSlot> findByTherapistId(Long therapistId);

  @Query("SELECT s FROM ScheduleSlot s JOIN s.students st WHERE st.id = :studentId")
  List<ScheduleSlot> findByStudentId(@Param("studentId") Long studentId);

  List<ScheduleSlot> findByStudentClassId(Long classId);

  @Query(
      """
        SELECT s FROM ScheduleSlot s
        WHERE s.therapist.id = :therapistId
        AND s.startTime < :endTime AND s.endTime > :startTime
    """)
  List<ScheduleSlot> findConflictsByTherapist(
      Long therapistId, LocalTime startTime, LocalTime endTime);

  @Query(
      """
        SELECT s FROM ScheduleSlot s
        WHERE s.room.id = :roomId
        AND s.startTime < :endTime AND s.endTime > :startTime
    """)
  List<ScheduleSlot> findConflictsByRoom(Long roomId, LocalTime startTime, LocalTime endTime);

  @Query(
      """
        SELECT s FROM ScheduleSlot s
        JOIN s.students st
        WHERE st.id = :studentId
        AND s.startTime < :endTime AND s.endTime > :startTime
    """)
  List<ScheduleSlot> findConflictsByStudent(Long studentId, LocalTime startTime, LocalTime endTime);

  @Query(
      """
    SELECT s FROM ScheduleSlot s
    WHERE s.therapist.id = :therapistId
      AND s.dayOfWeek = :dayOfWeek
      AND s.id <> :slotId
      AND (s.startTime < :end AND s.endTime > :start)
""")
  List<ScheduleSlot> findConflictsByTherapistAndDayExcludingSlot(
      @Param("therapistId") Long therapistId,
      @Param("dayOfWeek") int dayOfWeek,
      @Param("start") LocalTime start,
      @Param("end") LocalTime end,
      @Param("slotId") Long slotId);
}
