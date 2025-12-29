package com.eduyata.platform.repository;

import com.eduyata.platform.model.Enrollment;
import com.eduyata.platform.model.Student;
import com.eduyata.platform.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudent(Student student);
    
    List<Enrollment> findByCourse(Course course);
    
    Optional<Enrollment> findByStudentAndCourse(Student student, Course course);
    
    boolean existsByStudentAndCourse(Student student, Course course);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student = :student")
    long countEnrollmentsByStudent(@Param("student") Student student);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course = :course")
    long countEnrollmentsByCourse(@Param("course") Course course);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student = :student AND e.progressPercentage = 100")
    long countCompletedCoursesByStudent(@Param("student") Student student);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student = :student AND e.progressPercentage > 0 AND e.progressPercentage < 100")
    long countInProgressCoursesByStudent(@Param("student") Student student);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student = :student ORDER BY e.enrollmentDate DESC")
    List<Enrollment> findRecentEnrollmentsByStudent(@Param("student") Student student);
}