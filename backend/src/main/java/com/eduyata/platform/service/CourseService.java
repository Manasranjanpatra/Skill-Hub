package com.eduyata.platform.service;

import com.eduyata.platform.model.Course;
import com.eduyata.platform.model.Educator;
import com.eduyata.platform.model.Student;
import com.eduyata.platform.model.Enrollment;
import com.eduyata.platform.repository.CourseRepository;
import com.eduyata.platform.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getPublishedCourses() {
        return courseRepository.findByIsPublishedTrue();
    }

    public List<Course> getCoursesByInstructor(Educator instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    public List<Course> getCoursesByBoardAndClass(String board, String classLevel) {
        return courseRepository.findByBoardAndClassLevel(board, classLevel);
    }

    public List<Course> getCoursesBySubject(String subject) {
        return courseRepository.findBySubject(subject);
    }

    public List<Course> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContaining(title);
    }

    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public long getPublishedCoursesCount() {
        return courseRepository.countPublishedCourses();
    }

    public long getCoursesByInstructorCount(Educator instructor) {
        return courseRepository.countCoursesByInstructor(instructor);
    }

    public List<String> getDistinctCategories() {
        return courseRepository.findDistinctCategories();
    }

    public List<String> getDistinctBoards() {
        return courseRepository.findDistinctBoards();
    }

    public List<String> getSubjectsByBoardAndClass(String board, String classLevel) {
        return courseRepository.findSubjectsByBoardAndClass(board, classLevel);
    }

    // Enrollment methods
    public Enrollment enrollStudent(Student student, Course course) {
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new RuntimeException("Student already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(student, course);
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getStudentEnrollments(Student student) {
        return enrollmentRepository.findByStudent(student);
    }

    public List<Enrollment> getCourseEnrollments(Course course) {
        return enrollmentRepository.findByCourse(course);
    }

    public Optional<Enrollment> getEnrollment(Student student, Course course) {
        return enrollmentRepository.findByStudentAndCourse(student, course);
    }

    public long getEnrollmentCountByStudent(Student student) {
        return enrollmentRepository.countEnrollmentsByStudent(student);
    }

    public long getCompletedCoursesCountByStudent(Student student) {
        return enrollmentRepository.countCompletedCoursesByStudent(student);
    }

    public long getInProgressCoursesCountByStudent(Student student) {
        return enrollmentRepository.countInProgressCoursesByStudent(student);
    }

    public List<Enrollment> getRecentEnrollmentsByStudent(Student student) {
        return enrollmentRepository.findRecentEnrollmentsByStudent(student);
    }

    public Enrollment updateEnrollmentProgress(Long enrollmentId, Double progressPercentage, Integer completedVideos) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        if (enrollmentOpt.isPresent()) {
            Enrollment enrollment = enrollmentOpt.get();
            enrollment.setProgressPercentage(progressPercentage);
            if (completedVideos != null) {
                enrollment.setCompletedVideos(completedVideos);
            }
            return enrollmentRepository.save(enrollment);
        }
        throw new RuntimeException("Enrollment not found");
    }
}