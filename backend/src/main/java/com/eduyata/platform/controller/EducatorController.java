package com.eduyata.platform.controller;

import com.eduyata.platform.model.Educator;
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
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class EducatorController {

    @Autowired
    private EducatorService educatorService;

    @PostMapping("/teacher/register")
    public ResponseEntity<Map<String, Object>> registerTeacher(@RequestBody Map<String, Object> request) {
        try {
            Educator educator = new Educator();
            educator.setName((String) request.get("name"));
            educator.setEmail((String) request.get("email"));
            educator.setMobile((String) request.get("mobile"));
            educator.setSubject((String) request.get("subject"));
            educator.setQualification((String) request.get("qualification"));
            educator.setExperienceYears(request.get("experience_years") != null ? 
                Integer.parseInt(request.get("experience_years").toString()) : 0);
            educator.setBio((String) request.get("bio"));
            educator.setBoards((String) request.get("boards"));
            educator.setSubjectClasses((String) request.get("subject_classes"));

            String password = (String) request.get("password");
            
            Educator savedEducator = educatorService.registerEducator(educator, password);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Teacher registered successfully. Your account is pending admin approval.");
            response.put("status", "pending_approval");
            
            Map<String, Object> data = new HashMap<>();
            data.put("teacher_id", savedEducator.getTeacherId());
            data.put("name", savedEducator.getName());
            data.put("email", savedEducator.getEmail());
            data.put("profile_completed", savedEducator.getProfileCompleted());
            data.put("is_active", savedEducator.getIsActive());
            data.put("document_status", savedEducator.getDocumentStatus());
            
            response.put("data", data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/teacher/login")
    public ResponseEntity<Map<String, Object>> loginTeacher(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }

            Optional<Educator> educatorOpt = educatorService.authenticateEducator(email, password);
            
            if (educatorOpt.isPresent()) {
                Educator educator = educatorOpt.get();
                
                // Check if teacher is approved by admin
                if (!educator.getIsActive()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("error", "Your account is pending admin approval. Please wait for verification.");
                    response.put("status", "pending_approval");
                    response.put("document_status", educator.getDocumentStatus());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                
                Map<String, Object> data = new HashMap<>();
                data.put("role", "teacher");
                data.put("teacherId", educator.getTeacherId());
                data.put("id", educator.getId());
                data.put("name", educator.getName());
                data.put("email", educator.getEmail());
                data.put("profile_completed", educator.getProfileCompleted());
                data.put("is_active", educator.getIsActive());
                data.put("document_status", educator.getDocumentStatus());
                
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

    @GetMapping("/teachers")
    public ResponseEntity<Map<String, Object>> getAllTeachers() {
        try {
            List<Educator> teachers = educatorService.getAllEducators();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("teachers", teachers.stream().map(teacher -> {
                Map<String, Object> teacherData = new HashMap<>();
                teacherData.put("id", teacher.getId());
                teacherData.put("teacher_id", teacher.getTeacherId());
                teacherData.put("name", teacher.getName());
                teacherData.put("email", teacher.getEmail());
                teacherData.put("is_active", teacher.getIsActive());
                teacherData.put("document_status", teacher.getDocumentStatus());
                teacherData.put("created_at", teacher.getCreatedAt());
                return teacherData;
            }).toList());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/teacher/statistics")
    public ResponseEntity<Map<String, Object>> getTeacherStatistics() {
        try {
            long activeTeachers = educatorService.getActiveEducatorsCount();
            long pendingTeachers = educatorService.getPendingEducatorsCount();
            long totalTeachers = activeTeachers + pendingTeachers;

            Map<String, Object> statistics = new HashMap<>();
            statistics.put("active_teachers", activeTeachers);
            statistics.put("pending_teachers", pendingTeachers);
            statistics.put("total_teachers", totalTeachers);

            return ResponseEntity.ok(Map.of("status", "success", "statistics", statistics));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/teacher/{teacherId}/scope")
    public ResponseEntity<Map<String, Object>> getTeacherScope(@PathVariable String teacherId) {
        try {
            Optional<Educator> educatorOpt = educatorService.findByTeacherId(teacherId);
            
            if (!educatorOpt.isPresent()) {
                // Try finding by ID if teacherId lookup fails
                try {
                    Long id = Long.parseLong(teacherId);
                    educatorOpt = educatorService.findById(id);
                } catch (NumberFormatException e) {
                    // Ignore
                }
            }

            if (educatorOpt.isPresent()) {
                Educator educator = educatorOpt.get();
                
                Map<String, Object> teacherScope = new HashMap<>();
                teacherScope.put("boards", educator.getBoards() != null ? educator.getBoards() : "[]");
                teacherScope.put("subjects", educator.getSubject() != null ? List.of(educator.getSubject().split(",")) : List.of());
                teacherScope.put("classes_taught", List.of()); // This would need to be parsed from subjectClasses JSON
                teacherScope.put("qualification", educator.getQualification() != null ? educator.getQualification() : "");
                teacherScope.put("experience_years", educator.getExperienceYears() != null ? educator.getExperienceYears() : 0);

                return ResponseEntity.ok(Map.of("teacher_scope", teacherScope));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Teacher not found"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/teacher/{teacherId}/approve")
    public ResponseEntity<Map<String, Object>> approveTeacher(@PathVariable Long teacherId) {
        try {
            Educator educator = educatorService.approveEducator(teacherId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Teacher approved successfully");
            response.put("teacher", Map.of(
                "id", educator.getId(),
                "name", educator.getName(),
                "email", educator.getEmail(),
                "is_active", educator.getIsActive(),
                "document_status", educator.getDocumentStatus()
            ));
            
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/teacher/{teacherId}/reject")
    public ResponseEntity<Map<String, Object>> rejectTeacher(@PathVariable Long teacherId, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            if (reason == null || reason.isEmpty()) {
                reason = "Document verification failed";
            }
            
            Educator educator = educatorService.rejectEducator(teacherId, reason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Teacher rejected successfully");
            response.put("teacher", Map.of(
                "id", educator.getId(),
                "name", educator.getName(),
                "email", educator.getEmail(),
                "is_active", educator.getIsActive(),
                "document_status", educator.getDocumentStatus()
            ));
            
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}