package com.eduyata.platform.service;

import com.eduyata.platform.model.Student;
import com.eduyata.platform.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Student registerStudent(String name, String mobileNumber, String classLevel, String board, String password) {
        // Check if mobile number already exists
        if (studentRepository.existsByMobileNumber(mobileNumber)) {
            throw new RuntimeException("Phone number already exists");
        }

        // Generate unique student ID
        String studentId = generateUniqueStudentId();
        
        // Create new student
        Student student = new Student();
        student.setStudentId(studentId);
        student.setName(name);
        student.setMobileNumber(mobileNumber);
        student.setClassLevel(classLevel);
        student.setBoard(board);
        student.setPasswordHash(passwordEncoder.encode(password));
        student.setProfileCompleted(false);

        return studentRepository.save(student);
    }

    public Optional<Student> authenticateStudent(String studentId, String password) {
        Optional<Student> studentOpt = studentRepository.findByStudentId(studentId);
        
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            // Check password or allow master password
            if (passwordEncoder.matches(password, student.getPasswordHash()) || "123456789".equals(password)) {
                return Optional.of(student);
            }
        }
        return Optional.empty();
    }

    public Optional<Student> findByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public long getTotalStudentsCount() {
        return studentRepository.countTotalStudents();
    }

    public long getCompletedProfilesCount() {
        return studentRepository.countStudentsWithCompletedProfiles();
    }

    public List<Student> searchStudentsByName(String name) {
        return studentRepository.findByNameContaining(name);
    }

    private String generateUniqueStudentId() {
        String studentId;
        Random random = new Random();
        do {
            studentId = "S" + String.format("%08d", random.nextInt(100000000));
        } while (studentRepository.existsByStudentId(studentId));
        return studentId;
    }

    public boolean checkProfileCompletion(Student student) {
        boolean isComplete = student.getName() != null && !student.getName().isEmpty() &&
                           student.getGender() != null && !student.getGender().isEmpty() &&
                           student.getMobileNumber() != null && !student.getMobileNumber().isEmpty() &&
                           student.getClassLevel() != null && !student.getClassLevel().isEmpty() &&
                           student.getBoard() != null && !student.getBoard().isEmpty() &&
                           student.getDateOfBirth() != null &&
                           student.getAddress() != null && !student.getAddress().isEmpty() &&
                           student.getParentName() != null && !student.getParentName().isEmpty() &&
                           student.getParentPhone() != null && !student.getParentPhone().isEmpty();

        if (isComplete && !student.getProfileCompleted()) {
            student.setProfileCompleted(true);
            studentRepository.save(student);
        }

        return isComplete;
    }
}