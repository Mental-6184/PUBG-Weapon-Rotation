package com.example.pubg.config;

import com.example.pubg.model.Weapon;
import com.example.pubg.repository.WeaponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private WeaponRepository weaponRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // 检查是否已经存在数据
        if (weaponRepository.count() == 0) {
            initializeWeaponData();
        }
    }
    
    private void initializeWeaponData() {
        Map<String, String[]> weaponData = new HashMap<>();
        weaponData.put("手枪", new String[]{"P92", "P1911", "R1895", "P18C", "蝎式手枪", "信号枪"});
        weaponData.put("冲锋枪", new String[]{"Micro UZI", "UMP45", "Vector", "汤姆逊冲锋枪", "MP5K", "PP-19 Bizon"});
        weaponData.put("霰弹枪", new String[]{"S1897", "S686", "S12K", "DBS", "O12"});
        weaponData.put("突击步枪", new String[]{"AKM", "M16A4", "M416", "SCAR-L", "Beryl M762", "G36C", "QBZ", "AUG A3", "Groza"});
        weaponData.put("精确射手步枪", new String[]{"Mini 14", "SKS", "SLR", "QBU", "MK12", "Mk14"});
        weaponData.put("狙击枪", new String[]{"Kar98k", "M24", "Win94", "莫辛-纳甘", "AWM", "AMR"});
        weaponData.put("轻机枪", new String[]{"DP-28", "M249", "MG3"});
        weaponData.put("特殊武器", new String[]{"十字弩", "铁拳火箭筒", "迫击炮", "M79榴弹发射器", "C4", "尖刺陷阱", "防爆盾"});
        weaponData.put("近战武器", new String[]{"撬棍", "大砍刀", "镰刀", "平底锅"});
        weaponData.put("投掷物", new String[]{"破片手榴弹", "烟雾弹", "震撼弹", "燃烧瓶"});
        
        List<Weapon> weapons = new ArrayList<>();
        
        for (Map.Entry<String, String[]> entry : weaponData.entrySet()) {
            String type = entry.getKey();
            String[] names = entry.getValue();
            
            for (String name : names) {
                weapons.add(new Weapon(name, type));
            }
        }
        
        weaponRepository.saveAll(weapons);
        System.out.println("Initialized " + weapons.size() + " weapons in the database.");
    }
}