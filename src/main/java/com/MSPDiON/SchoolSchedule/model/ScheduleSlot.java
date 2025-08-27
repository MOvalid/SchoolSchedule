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

    @Column
    private String title;

    @ManyToOne(optional = false)
    @JoinColumn(name = "therapist_id")
    private Therapist therapist;

    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private boolean isIndividual;

    @ManyToOne
    @JoinColumn(name = "student_class_id")
    private StudentClass studentClass;

    @ManyToMany
    @JoinTable(
            name = "schedule_slot_students",
            joinColumns = @JoinColumn(name = "schedule_slot_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students;
}
