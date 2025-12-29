package com.eduyata.platform.controller;

import com.eduyata.platform.model.Course;
import com.eduyata.platform.model.Student;
import com.eduyata.platform.model.Educator;
import com.eduyata.platform.model.Enrollment;
import com.eduyata.platform.service.CourseService;
import com.eduyata.platform.service.StudentService;
import com.eduyata.platform.service.EducatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private EducatorService educatorService;

    @GetMapping("/dashboard_stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@RequestParam Long student_id) {
        try {
            Optional<Student> studentOpt = studentService.findById(student_id);
            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
            }

            Student student = studentOpt.get();
            long enrolledCourses = courseService.getEnrollmentCountByStudent(student);
            long completedCourses = courseService.getCompletedCoursesCountByStudent(student);
            long inProgressCourses = courseService.getInProgressCoursesCountByStudent(student);

            Map<String, Object> data = new HashMap<>();
            data.put("enrolled_courses", enrolledCourses);
            data.put("completed_courses", completedCourses);
            data.put("in_progress_courses", inProgressCourses);
            data.put("completed_videos", 0); // This would need video progress tracking

            return ResponseEntity.ok(Map.of("status", "success", "data", data));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my_courses")
    public ResponseEntity<Map<String, Object>> getMyCourses(@RequestParam Long student_id) {
        try {
            Optional<Student> studentOpt = studentService.findById(student_id);
            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
            }

            Student student = studentOpt.get();
            List<Enrollment> enrollments = courseService.getStudentEnrollments(student);

            List<Map<String, Object>> courses = enrollments.stream().map(enrollment -> {
                Course course = enrollment.getCourse();
                Map<String, Object> courseData = new HashMap<>();
                courseData.put("id", course.getId());
                courseData.put("title", course.getTitle());
                courseData.put("instructor_name", course.getInstructor() != null ? course.getInstructor().getName() : "Instructor");
                courseData.put("progress_percentage", enrollment.getProgressPercentage());
                courseData.put("thumbnail_url", course.getThumbnailUrl());
                courseData.put("category", course.getCategory());
                return courseData;
            }).toList();

            return ResponseEntity.ok(Map.of("status", "success", "data", courses));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/recent_activity")
    public ResponseEntity<Map<String, Object>> getRecentActivity(@RequestParam Long student_id) {
        try {
            // This would typically come from an activity log table
            // For now, returning mock data similar to Django implementation
            List<Map<String, Object>> activities = List.of(
                Map.of("id", 1, "action", "Completed lesson", "subject", "Derivatives", 
                       "course_name", "Calculus", "time_ago", "2 hours ago", "activity_type", "completed"),
                Map.of("id", 2, "action", "Submitted assignment", "subject", "JS Functions", 
                       "course_name", "Web Dev", "time_ago", "Yesterday", "activity_type", "submitted"),
                Map.of("id", 3, "action", "Started new course", "subject", "Creative Writing", 
                       "course_name", "", "time_ago", "3 days ago", "activity_type", "started"),
                Map.of("id", 4, "action", "Achieved badge", "subject", "Fast Learner", 
                       "course_name", "", "time_ago", "1 week ago", "activity_type", "achievement")
            );

            return ResponseEntity.ok(Map.of("status", "success", "data", activities));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllCourses() {
        try {
            List<Course> courses = courseService.getPublishedCourses();
            
            List<Map<String, Object>> courseList = courses.stream().map(course -> {
                Map<String, Object> courseData = new HashMap<>();
                courseData.put("id", course.getId());
                courseData.put("title", course.getTitle());
                courseData.put("description", course.getDescription());
                courseData.put("instructor_name", course.getInstructor() != null ? course.getInstructor().getName() : "Instructor");
                courseData.put("category", course.getCategory());
                courseData.put("level", course.getLevel());
                courseData.put("board", course.getBoard());
                courseData.put("class_level", course.getClassLevel());
                courseData.put("subject", course.getSubject());
                courseData.put("thumbnail_url", course.getThumbnailUrl());
                courseData.put("duration", course.getDuration());
                courseData.put("price", course.getPrice());
                courseData.put("is_free", course.getIsFree());
                return courseData;
            }).toList();

            return ResponseEntity.ok(Map.of("status", "success", "data", courseList));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCourseById(@PathVariable Long id) {
        try {
            Optional<Course> courseOpt = courseService.findById(id);
            if (!courseOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Course not found"));
            }

            Course course = courseOpt.get();
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("id", course.getId());
            courseData.put("title", course.getTitle());
            courseData.put("description", course.getDescription());
            courseData.put("instructor_name", course.getInstructor() != null ? course.getInstructor().getName() : "Instructor");
            courseData.put("category", course.getCategory());
            courseData.put("level", course.getLevel());
            courseData.put("board", course.getBoard());
            courseData.put("class_level", course.getClassLevel());
            courseData.put("subject", course.getSubject());
            courseData.put("thumbnail_url", course.getThumbnailUrl());
            courseData.put("video_url", course.getVideoUrl());
            courseData.put("duration", course.getDuration());
            courseData.put("price", course.getPrice());
            courseData.put("is_free", course.getIsFree());

            return ResponseEntity.ok(Map.of("status", "success", "data", courseData));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createCourse(@RequestBody Map<String, Object> request) {
        try {
            Long instructorId = Long.parseLong(request.get("instructor_id").toString());
            Optional<Educator> instructorOpt = educatorService.findById(instructorId);
            
            if (!instructorOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Instructor not found"));
            }

            Course course = new Course();
            course.setTitle((String) request.get("title"));
            course.setDescription((String) request.get("description"));
            course.setInstructor(instructorOpt.get());
            course.setCategory((String) request.get("category"));
            course.setLevel((String) request.get("level"));
            course.setBoard((String) request.get("board"));
            course.setClassLevel((String) request.get("class_level"));
            course.setSubject((String) request.get("subject"));
            course.setThumbnailUrl((String) request.get("thumbnail_url"));
            course.setVideoUrl((String) request.get("video_url"));
            
            if (request.containsKey("duration")) {
                course.setDuration(Integer.parseInt(request.get("duration").toString()));
            }
            if (request.containsKey("price")) {
                course.setPrice(Double.parseDouble(request.get("price").toString()));
            }
            if (request.containsKey("is_free")) {
                course.setIsFree((Boolean) request.get("is_free"));
            }

            Course savedCourse = courseService.createCourse(course);

            Map<String, Object> courseData = new HashMap<>();
            courseData.put("id", savedCourse.getId());
            courseData.put("title", savedCourse.getTitle());
            courseData.put("description", savedCourse.getDescription());
            courseData.put("category", savedCourse.getCategory());

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "success",
                "message", "Course created successfully",
                "data", courseData
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/enroll")
    public ResponseEntity<Map<String, Object>> enrollInCourse(@RequestBody Map<String, Object> request) {
        try {
            Long studentId = Long.parseLong(request.get("student_id").toString());
            Long courseId = Long.parseLong(request.get("course_id").toString());

            Optional<Student> studentOpt = studentService.findById(studentId);
            Optional<Course> courseOpt = courseService.findById(courseId);

            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
            }
            if (!courseOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Course not found"));
            }

            Enrollment enrollment = courseService.enrollStudent(studentOpt.get(), courseOpt.get());

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "success",
                "message", "Successfully enrolled in course",
                "enrollment_id", enrollment.getId()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        try {
            List<String> categories = courseService.getDistinctCategories();
            return ResponseEntity.ok(Map.of("status", "success", "data", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/boards")
    public ResponseEntity<Map<String, Object>> getBoards() {
        try {
            List<String> boards = courseService.getDistinctBoards();
            return ResponseEntity.ok(Map.of("status", "success", "data", boards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/subjects")
    public ResponseEntity<Map<String, Object>> getSubjects(@RequestParam String board, @RequestParam String class_level) {
        try {
            List<String> subjects = courseService.getSubjectsByBoardAndClass(board, class_level);
            return ResponseEntity.ok(Map.of("status", "success", "data", subjects));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}