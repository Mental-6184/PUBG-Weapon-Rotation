package com.example.pubg.repository;

import com.example.pubg.model.DrawRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrawRecordRepository extends JpaRepository<DrawRecord, Long> {
    List<DrawRecord> findFirst10ByOrderByDrawTimeDesc();
}