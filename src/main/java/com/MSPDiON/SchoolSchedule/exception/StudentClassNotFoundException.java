package com.MSPDiON.SchoolSchedule.exception;

public class StudentClassNotFoundException extends RuntimeException {
    public StudentClassNotFoundException(Long id) {
        super("Student class not found with id: " + id);
    }
}

