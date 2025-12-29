package com.eduyata.platform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "enrollment_date")
    private LocalDateTime enrollmentDate;

    private String status = "active";

    @Column(name = "progress_percentage")
    private Double progressPercentage = 0.0;

    @Column(name = "completed_videos")
    private Integer completedVideos = 0;

    @Column(name = "total_videos")
    private Integer totalVideos = 0;

    @PrePersist
    protected void onCreate() {
        enrollmentDate = LocalDateTime.now();
    }

    // Constructors
    public Enrollment() {}

    public Enrollment(Student student, Course course) {
        this.student = student;
        this.course = course;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public LocalDateTime getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDateTime enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public Integer getCompletedVideos() { return completedVideos; }
    public void setCompletedVideos(Integer completedVideos) { this.completedVideos = completedVideos; }

    public Integer getTotalVideos() { return totalVideos; }
    public void setTotalVideos(Integer totalVideos) { this.totalVideos = totalVideos; }
}