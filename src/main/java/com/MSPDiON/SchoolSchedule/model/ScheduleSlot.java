package com.MSPDiON.SchoolSchedule.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Therapist therapist;

    @ManyToOne
    private Room room;

    private LocalTime startTime;
    private LocalTime endTime;
    private DayOfWeek dayOfWeek;

    private boolean isIndividual;

    @ManyToOne
    private StudentClass studentClass;

    @ManyToMany
    @JoinTable(
            name = "schedule_slot_students",
            joinColumns = @JoinColumn(name = "schedule_slot_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students;
}
