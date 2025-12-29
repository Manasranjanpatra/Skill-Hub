package com.eduyata.platform.repository;

import com.eduyata.platform.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByStudentId(String studentId);
    
    Optional<Student> findByMobileNumber(String mobileNumber);
    
    boolean existsByMobileNumber(String mobileNumber);
    
    boolean existsByStudentId(String studentId);
    
    @Query("SELECT COUNT(s) FROM Student s")
    long countTotalStudents();
    
    @Query("SELECT COUNT(s) FROM Student s WHERE s.profileCompleted = true")
    long countStudentsWithCompletedProfiles();
    
    @Query("SELECT s FROM Student s WHERE s.name LIKE %:name%")
    java.util.List<Student> findByNameContaining(@Param("name") String name);
}