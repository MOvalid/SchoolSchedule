package com.MSPDiON.SchoolSchedule.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Therapist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private TherapistRole role;

    @ElementCollection(targetClass = Department.class, fetch = FetchType.EAGER)
    @CollectionTable(
            name = "therapist_departments",
            joinColumns = @JoinColumn(name = "therapist_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "department")
    private List<Department> departments;
}
