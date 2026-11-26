package com.edumanager;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String major;
    private java.time.LocalDate birthDate;
    private java.math.BigDecimal grade;
    @ElementCollection
    private java.util.List<String> programs = new java.util.ArrayList<>();

    public Long getId() { return id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String value) { firstName = value; }

    public String getLastName() { return lastName; }
    public void setLastName(String value) { lastName = value; }

    public String getEmail() { return email; }
    public void setEmail(String value) { email = value; }

    public String getMajor() { return major; }
    public void setMajor(String value) { major = value; }

    public java.time.LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(java.time.LocalDate value) { birthDate = value; }

    public java.math.BigDecimal getGrade() { return grade; }
    public void setGrade(java.math.BigDecimal value) { grade = value; }

    public java.util.List<String> getPrograms() { return programs; }
    public void setPrograms(java.util.List<String> value) { programs = new java.util.ArrayList<>(value); }
}
