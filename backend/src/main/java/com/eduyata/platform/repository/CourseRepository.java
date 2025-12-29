package com.eduyata.platform.repository;

import com.eduyata.platform.model.Course;
import com.eduyata.platform.model.Educator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByIsPublishedTrue();
    
    List<Course> findByInstructor(Educator instructor);
    
    List<Course> findByCategory(String category);
    
    List<Course> findByBoardAndClassLevel(String board, String classLevel);
    
    List<Course> findBySubject(String subject);
    
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:title%")
    List<Course> findByTitleContaining(@Param("title") String title);
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.isPublished = true")
    long countPublishedCourses();
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructor = :instructor")
    long countCoursesByInstructor(@Param("instructor") Educator instructor);
    
    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.isPublished = true")
    List<String> findDistinctCategories();
    
    @Query("SELECT DISTINCT c.board FROM Course c WHERE c.isPublished = true")
    List<String> findDistinctBoards();
    
    @Query("SELECT DISTINCT c.subject FROM Course c WHERE c.board = :board AND c.classLevel = :classLevel")
    List<String> findSubjectsByBoardAndClass(@Param("board") String board, @Param("classLevel") String classLevel);
}