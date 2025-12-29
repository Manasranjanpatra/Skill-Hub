package com.eduyata.platform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "educators")
public class Educator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "teacher_id", unique = true)
    private String teacherId;

    @NotBlank
    private String name;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String mobile;

    @Column(name = "password_hash")
    private String passwordHash;

    private String subject;
    private String qualification;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    @Column(name = "highest_qualification")
    private String highestQualification;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "JSON")
    private String boards;

    @Column(name = "subject_classes", columnDefinition = "JSON")
    private String subjectClasses;

    @Column(name = "languages_known", columnDefinition = "JSON")
    private String languagesKnown;

    @Column(name = "teaching_experience_institutes", columnDefinition = "JSON")
    private String teachingExperienceInstitutes;

    @Column(name = "cv_file")
    private String cvFile;

    @Column(name = "achievements_file")
    private String achievementsFile;

    @Column(name = "experience_proof_file")
    private String experienceProofFile;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "degree_certificate")
    private String degreeCertificate;

    @Column(name = "profile_completed")
    private Boolean profileCompleted = true;

    @Column(name = "is_active")
    private Boolean isActive = false;

    @Column(name = "document_status")
    private String documentStatus = "Pending Verification";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (teacherId == null) {
            generateTeacherId();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private void generateTeacherId() {
        int year = LocalDateTime.now().getYear();
        this.teacherId = String.format("TCH%d%05d", year, this.id != null ? this.id : 0);
    }

    // Constructors
    public Educator() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getHighestQualification() { return highestQualification; }
    public void setHighestQualification(String highestQualification) { this.highestQualification = highestQualification; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getBoards() { return boards; }
    public void setBoards(String boards) { this.boards = boards; }

    public String getSubjectClasses() { return subjectClasses; }
    public void setSubjectClasses(String subjectClasses) { this.subjectClasses = subjectClasses; }

    public String getLanguagesKnown() { return languagesKnown; }
    public void setLanguagesKnown(String languagesKnown) { this.languagesKnown = languagesKnown; }

    public String getTeachingExperienceInstitutes() { return teachingExperienceInstitutes; }
    public void setTeachingExperienceInstitutes(String teachingExperienceInstitutes) { this.teachingExperienceInstitutes = teachingExperienceInstitutes; }

    public String getCvFile() { return cvFile; }
    public void setCvFile(String cvFile) { this.cvFile = cvFile; }

    public String getAchievementsFile() { return achievementsFile; }
    public void setAchievementsFile(String achievementsFile) { this.achievementsFile = achievementsFile; }

    public String getExperienceProofFile() { return experienceProofFile; }
    public void setExperienceProofFile(String experienceProofFile) { this.experienceProofFile = experienceProofFile; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getDegreeCertificate() { return degreeCertificate; }
    public void setDegreeCertificate(String degreeCertificate) { this.degreeCertificate = degreeCertificate; }

    public Boolean getProfileCompleted() { return profileCompleted; }
    public void setProfileCompleted(Boolean profileCompleted) { this.profileCompleted = profileCompleted; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getDocumentStatus() { return documentStatus; }
    public void setDocumentStatus(String documentStatus) { this.documentStatus = documentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}