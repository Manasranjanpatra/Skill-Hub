package com.eduyata.platform.repository;

import com.eduyata.platform.model.Educator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface EducatorRepository extends JpaRepository<Educator, Long> {
    
    Optional<Educator> findByEmail(String email);
    
    Optional<Educator> findByTeacherId(String teacherId);
    
    Optional<Educator> findByMobile(String mobile);
    
    boolean existsByEmail(String email);
    
    boolean existsByMobile(String mobile);
    
    List<Educator> findByIsActiveTrue();
    
    List<Educator> findByIsActiveFalse();
    
    @Query("SELECT COUNT(e) FROM Educator e WHERE e.isActive = true")
    long countActiveEducators();
    
    @Query("SELECT COUNT(e) FROM Educator e WHERE e.isActive = false")
    long countPendingEducators();
    
    @Query("SELECT e FROM Educator e WHERE e.documentStatus = :status")
    List<Educator> findByDocumentStatus(String status);
}