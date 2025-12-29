package com.eduyata.platform.service;

import com.eduyata.platform.model.Educator;
import com.eduyata.platform.repository.EducatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EducatorService {

    @Autowired
    private EducatorRepository educatorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Educator registerEducator(Educator educator, String password) {
        // Check if email already exists
        if (educatorRepository.existsByEmail(educator.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if mobile already exists
        if (educatorRepository.existsByMobile(educator.getMobile())) {
            throw new RuntimeException("Mobile number already exists");
        }

        // Set password
        educator.setPasswordHash(passwordEncoder.encode(password));
        
        // Set default values
        educator.setIsActive(false); // Pending admin approval
        educator.setDocumentStatus("Pending Verification");
        educator.setProfileCompleted(true);

        return educatorRepository.save(educator);
    }

    public Optional<Educator> authenticateEducator(String email, String password) {
        Optional<Educator> educatorOpt = educatorRepository.findByEmail(email);
        
        if (educatorOpt.isPresent()) {
            Educator educator = educatorOpt.get();
            if (passwordEncoder.matches(password, educator.getPasswordHash())) {
                return Optional.of(educator);
            }
        }
        return Optional.empty();
    }

    public Optional<Educator> findByEmail(String email) {
        return educatorRepository.findByEmail(email);
    }

    public Optional<Educator> findByTeacherId(String teacherId) {
        return educatorRepository.findByTeacherId(teacherId);
    }

    public Optional<Educator> findById(Long id) {
        return educatorRepository.findById(id);
    }

    public Educator updateEducator(Educator educator) {
        return educatorRepository.save(educator);
    }

    public List<Educator> getAllEducators() {
        return educatorRepository.findAll();
    }

    public List<Educator> getActiveEducators() {
        return educatorRepository.findByIsActiveTrue();
    }

    public List<Educator> getPendingEducators() {
        return educatorRepository.findByIsActiveFalse();
    }

    public long getActiveEducatorsCount() {
        return educatorRepository.countActiveEducators();
    }

    public long getPendingEducatorsCount() {
        return educatorRepository.countPendingEducators();
    }

    public List<Educator> getEducatorsByDocumentStatus(String status) {
        return educatorRepository.findByDocumentStatus(status);
    }

    public Educator approveEducator(Long educatorId) {
        Optional<Educator> educatorOpt = educatorRepository.findById(educatorId);
        if (educatorOpt.isPresent()) {
            Educator educator = educatorOpt.get();
            educator.setIsActive(true);
            educator.setDocumentStatus("Approved");
            return educatorRepository.save(educator);
        }
        throw new RuntimeException("Educator not found");
    }

    public Educator rejectEducator(Long educatorId, String reason) {
        Optional<Educator> educatorOpt = educatorRepository.findById(educatorId);
        if (educatorOpt.isPresent()) {
            Educator educator = educatorOpt.get();
            educator.setIsActive(false);
            educator.setDocumentStatus("Rejected: " + reason);
            return educatorRepository.save(educator);
        }
        throw new RuntimeException("Educator not found");
    }
}