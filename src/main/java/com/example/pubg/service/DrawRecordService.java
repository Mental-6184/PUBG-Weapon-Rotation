package com.example.pubg.service;

import com.example.pubg.model.DrawRecord;
import com.example.pubg.model.Weapon;
import com.example.pubg.repository.DrawRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.logging.Logger;

@Service
public class DrawRecordService {
    
    private static final Logger logger = Logger.getLogger(DrawRecordService.class.getName());
    
    @Autowired
    private DrawRecordRepository drawRecordRepository;
    
    public DrawRecord saveDrawRecord(Weapon weapon) {
        // 参数验证
        if (weapon == null) {
            logger.warning("Attempt to save null weapon");
            return null;
        }
        
        if (weapon.getName() == null || weapon.getType() == null) {
            logger.warning("Attempt to save weapon with null name or type: " + weapon);
            return null;
        }
        
        try {
            DrawRecord record = new DrawRecord(weapon.getName(), weapon.getType());
            return drawRecordRepository.save(record);
        } catch (Exception e) {
            logger.severe("Error saving draw record: " + e.getMessage());
            return null;
        }
    }
    
    public List<DrawRecord> getLatestRecords() {
        try {
            return drawRecordRepository.findFirst10ByOrderByDrawTimeDesc();
        } catch (Exception e) {
            logger.severe("Error getting latest records: " + e.getMessage());
            return List.of();
        }
    }
    
    public Weapon drawRandomWeapon(List<Weapon> weapons) {
        // 参数验证
        if (weapons == null || weapons.isEmpty()) {
            logger.warning("Attempt to draw from null or empty weapon list");
            return null;
        }

        try {
            // 确保武器列表排序一致
            weapons.sort(null); // 使用Weapon类的compareTo方法

            // 使用ThreadLocalRandom确保更好的随机性和线程安全性
            ThreadLocalRandom random = ThreadLocalRandom.current();

            // 添加额外的随机化步骤以提高公平性
            // 1. 生成多个候选索引，取其中一个
            int candidates = Math.min(weapons.size(), 5); // 最多5个候选
            int[] candidateIndices = new int[candidates];

            for (int i = 0; i < candidates; i++) {
                candidateIndices[i] = random.nextInt(weapons.size());
            }

            // 2. 从候选索引中随机选择一个
            int selectedCandidateIndex = random.nextInt(candidates);
            int finalIndex = candidateIndices[selectedCandidateIndex];

            Weapon selected = weapons.get(finalIndex);

            // 验证选中的武器
            if (selected == null) {
                logger.warning("Selected null weapon from list at index: " + finalIndex);
                return null;
            }

            if (selected.getName() == null || selected.getType() == null) {
                logger.warning("Selected weapon with null name or type: " + selected);
                return null;
            }

            // 记录抽奖统计信息（用于调试公平性）
            logger.fine(String.format("Draw result: %s (%s) from %d weapons",
                selected.getName(), selected.getType(), weapons.size()));

            return selected;
        } catch (Exception e) {
            logger.severe("Error drawing random weapon: " + e.getMessage());
            return null;
        }
    }
    
    // 清除所有历史记录
    public void clearAllRecords() {
        try {
            drawRecordRepository.deleteAll();
        } catch (Exception e) {
            logger.severe("Error clearing all records: " + e.getMessage());
        }
    }

    // 获取抽奖统计信息（用于验证公平性）
    public Map<String, Object> getDrawStatistics() {
        Map<String, Object> stats = new HashMap<>();

        try {
            List<DrawRecord> allRecords = drawRecordRepository.findAll();

            // 统计总数
            stats.put("totalDraws", allRecords.size());

            // 按武器类型统计
            Map<String, Integer> typeStats = new HashMap<>();
            Map<String, Integer> weaponStats = new HashMap<>();

            for (DrawRecord record : allRecords) {
                // 类型统计
                typeStats.put(record.getWeaponType(),
                    typeStats.getOrDefault(record.getWeaponType(), 0) + 1);

                // 具体武器统计
                String weaponKey = record.getWeaponType() + " - " + record.getWeaponName();
                weaponStats.put(weaponKey,
                    weaponStats.getOrDefault(weaponKey, 0) + 1);
            }

            stats.put("typeStatistics", typeStats);
            stats.put("weaponStatistics", weaponStats);

            // 计算理论概率（如果有武器数据的话）
            // 这里可以扩展为更详细的公平性分析

        } catch (Exception e) {
            logger.severe("Error getting draw statistics: " + e.getMessage());
            stats.put("error", "Failed to retrieve statistics");
        }

        return stats;
    }
}