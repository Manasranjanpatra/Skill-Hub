package com.eduyata.platform.controller;

import com.eduyata.platform.model.Student;
import com.eduyata.platform.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/student/register")
    public ResponseEntity<Map<String, Object>> registerStudent(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String mobileNumber = request.get("mobile_self");
            String classLevel = request.get("class_level");
            String board = request.get("board");
            String password = request.get("password");

            if (name == null || mobileNumber == null || classLevel == null || board == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
            }

            Student student = studentService.registerStudent(name, mobileNumber, classLevel, board, password);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Student registered successfully");
            response.put("student_id", student.getStudentId());
            
            Map<String, Object> data = new HashMap<>();
            data.put("role", "student");
            data.put("student_id", student.getStudentId());
            data.put("id", student.getId());
            data.put("name", student.getName());
            data.put("phone", student.getMobileNumber());
            data.put("class", student.getClassLevel());
            data.put("board", student.getBoard());
            data.put("profile_completed", student.getProfileCompleted());
            
            response.put("data", data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/student/login")
    public ResponseEntity<Map<String, Object>> loginStudent(@RequestBody Map<String, String> request) {
        try {
            String studentId = request.get("studentId");
            String password = request.get("password");

            if (studentId == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student ID and password are required"));
            }

            Optional<Student> studentOpt = studentService.authenticateStudent(studentId, password);
            
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                
                Map<String, Object> data = new HashMap<>();
                data.put("role", "student");
                data.put("student_id", student.getStudentId());
                data.put("id", student.getId());
                data.put("name", student.getName());
                data.put("phone", student.getMobileNumber());
                data.put("class", student.getClassLevel());
                data.put("board", student.getBoard());
                data.put("gender", student.getGender() != null ? student.getGender() : "");
                data.put("profile_picture", student.getProfilePicture() != null ? student.getProfilePicture() : "");
                data.put("profile_completed", student.getProfileCompleted());
                
                response.put("data", data);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @GetMapping("/get_student")
    public ResponseEntity<Map<String, Object>> getStudent(@RequestParam String student_id) {
        try {
            Optional<Student> studentOpt;
            
            if (student_id.startsWith("STU")) {
                studentOpt = studentService.findByStudentId(student_id);
            } else {
                studentOpt = studentService.findById(Long.parseLong(student_id));
            }

            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                
                Map<String, Object> data = new HashMap<>();
                data.put("id", student.getId());
                data.put("student_id", student.getStudentId());
                data.put("name", student.getName());
                data.put("mobile_self", student.getMobileNumber());
                data.put("class", student.getClassLevel());
                data.put("board", student.getBoard());
                data.put("gender", student.getGender() != null ? student.getGender() : "");
                data.put("date_of_birth", student.getDateOfBirth() != null ? student.getDateOfBirth().toString() : "");
                data.put("address", student.getAddress() != null ? student.getAddress() : "");
                data.put("parent_name", student.getParentName() != null ? student.getParentName() : "");
                data.put("parent_phone", student.getParentPhone() != null ? student.getParentPhone() : "");
                data.put("interests", student.getInterests() != null ? student.getInterests() : "");
                data.put("profile_picture", student.getProfilePicture() != null ? student.getProfilePicture() : "");
                data.put("profile_completed", student.getProfileCompleted());

                return ResponseEntity.ok(Map.of("status", "success", "data", data));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/update_student")
    public ResponseEntity<Map<String, Object>> updateStudent(@RequestBody Map<String, Object> request) {
        try {
            String studentId = (String) request.get("student_id");
            if (studentId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student ID is required"));
            }

            Optional<Student> studentOpt = studentService.findByStudentId(studentId);
            if (!studentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
            }

            Student student = studentOpt.get();

            // Update fields
            if (request.containsKey("name")) student.setName((String) request.get("name"));
            if (request.containsKey("gender")) student.setGender((String) request.get("gender"));
            if (request.containsKey("mobile_self")) student.setMobileNumber((String) request.get("mobile_self"));
            if (request.containsKey("class")) student.setClassLevel((String) request.get("class"));
            if (request.containsKey("board")) student.setBoard((String) request.get("board"));
            if (request.containsKey("address")) student.setAddress((String) request.get("address"));
            if (request.containsKey("parent_name")) student.setParentName((String) request.get("parent_name"));
            if (request.containsKey("parent_phone")) student.setParentPhone((String) request.get("parent_phone"));
            if (request.containsKey("interests")) student.setInterests((String) request.get("interests"));
            if (request.containsKey("profile_picture")) student.setProfilePicture((String) request.get("profile_picture"));

            // Handle date of birth
            if (request.containsKey("date_of_birth")) {
                String dobStr = (String) request.get("date_of_birth");
                if (dobStr != null && !dobStr.isEmpty()) {
                    try {
                        student.setDateOfBirth(LocalDate.parse(dobStr));
                    } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format for date_of_birth"));
                    }
                }
            }

            student = studentService.updateStudent(student);

            Map<String, Object> data = new HashMap<>();
            data.put("id", student.getId());
            data.put("student_id", student.getStudentId());
            data.put("name", student.getName());
            data.put("gender", student.getGender());
            data.put("mobile_self", student.getMobileNumber());
            data.put("class", student.getClassLevel());
            data.put("board", student.getBoard());
            data.put("profile_picture", student.getProfilePicture());
            data.put("profile_completed", student.getProfileCompleted());

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Student updated successfully",
                "data", data
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/complete_profile/{student_id}")
    public ResponseEntity<Map<String, String>> completeProfile(@PathVariable Long student_id) {
        try {
            Optional<Student> studentOpt = studentService.findById(student_id);
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                student.setProfileCompleted(true);
                studentService.updateStudent(student);
                return ResponseEntity.ok(Map.of("message", "Profile completed"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Student not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}