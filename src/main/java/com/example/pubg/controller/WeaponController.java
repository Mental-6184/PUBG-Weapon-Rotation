package com.example.pubg.controller;

import com.example.pubg.model.Weapon;
import com.example.pubg.model.DrawRecord;
import com.example.pubg.service.WeaponService;
import com.example.pubg.service.DrawRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/weapons")
@CrossOrigin(origins = "*")
public class WeaponController {
    
    private static final Logger logger = Logger.getLogger(WeaponController.class.getName());
    
    @Autowired
    private WeaponService weaponService;
    
    @Autowired
    private DrawRecordService drawRecordService;
    
    // 获取所有武器类型
    @GetMapping("/types")
    public ResponseEntity<List<String>> getWeaponTypes() {
        try {
            List<String> types = Arrays.asList(
                "手枪", "冲锋枪", "霰弹枪", "突击步枪", 
                "精确射手步枪", "狙击枪", "轻机枪", "特殊武器", 
                "近战武器", "投掷物"
            );
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            logger.severe("Error getting weapon types: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 根据类型获取武器
    @PostMapping("/by-types")
    public ResponseEntity<List<Weapon>> getWeaponsByTypes(@RequestBody List<String> types) {
        try {
            if (types == null) {
                types = List.of();
            }
            
            List<Weapon> weapons = weaponService.getWeaponsByTypes(types);
            // 确保武器列表排序一致
            weapons.sort(null); // 使用Weapon类的compareTo方法
            
            return ResponseEntity.ok(weapons);
        } catch (Exception e) {
            logger.severe("Error getting weapons by types: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 随机抽取武器
    @PostMapping("/draw")
    public ResponseEntity<DrawRecord> drawWeapon(@RequestBody List<String> types) {
        try {
            if (types == null) {
                types = List.of();
            }
            
            List<Weapon> weapons = weaponService.getWeaponsByTypes(types);
            // 确保武器列表排序一致
            weapons.sort(null); // 使用Weapon类的compareTo方法
            
            Weapon selectedWeapon = drawRecordService.drawRandomWeapon(weapons);
            
            if (selectedWeapon != null) {
                DrawRecord record = drawRecordService.saveDrawRecord(selectedWeapon);
                if (record != null) {
                    return ResponseEntity.ok(record);
                }
            }
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.severe("Error drawing weapon: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取最近的抽取记录
    @GetMapping("/records")
    public ResponseEntity<List<DrawRecord>> getRecentRecords() {
        try {
            List<DrawRecord> records = drawRecordService.getLatestRecords();
            return ResponseEntity.ok(records);
        } catch (Exception e) {
            logger.severe("Error getting recent records: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 清除历史记录
    @DeleteMapping("/clear-history")
    public ResponseEntity<Void> clearHistory() {
        try {
            drawRecordService.clearAllRecords();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.severe("Error clearing history: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // 获取抽奖统计信息
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        try {
            Map<String, Object> stats = drawRecordService.getDrawStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.severe("Error getting statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}