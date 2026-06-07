package com.example.pubg.service;

import com.example.pubg.model.Weapon;
import com.example.pubg.repository.WeaponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeaponService {
    
    @Autowired
    private WeaponRepository weaponRepository;
    
    public List<Weapon> getAllWeapons() {
        List<Weapon> weapons = weaponRepository.findAll();
        // 按类型和名称排序，确保顺序一致
        weapons.sort(null); // 使用Weapon类的compareTo方法
        return weapons;
    }
    
    public List<Weapon> getWeaponsByTypes(List<String> types) {
        if (types == null || types.isEmpty()) {
            return getAllWeapons();
        }
        
        List<Weapon> weapons = weaponRepository.findByTypeIn(types);
        // 按类型和名称排序，确保顺序一致
        weapons.sort(null); // 使用Weapon类的compareTo方法
        return weapons;
    }
    
    // 初始化武器数据
    public void initializeWeapons() {
        if (weaponRepository.count() == 0) {
            // 手枪
            weaponRepository.save(new Weapon("P1911", "手枪"));
            weaponRepository.save(new Weapon("P92", "手枪"));
            weaponRepository.save(new Weapon("G18", "手枪"));
            weaponRepository.save(new Weapon("R1895", "手枪"));
            weaponRepository.save(new Weapon("Vz61", "手枪"));
            
            // 冲锋枪
            weaponRepository.save(new Weapon("Vector", "冲锋枪"));
            weaponRepository.save(new Weapon("UZI", "冲锋枪"));
            weaponRepository.save(new Weapon("UMP45", "冲锋枪"));
            weaponRepository.save(new Weapon("Bizon", "冲锋枪"));
            weaponRepository.save(new Weapon("MP5K", "冲锋枪"));
            
            // 霰弹枪
            weaponRepository.save(new Weapon("S1897", "霰弹枪"));
            weaponRepository.save(new Weapon("S686", "霰弹枪"));
            weaponRepository.save(new Weapon("S12K", "霰弹枪"));
            weaponRepository.save(new Weapon("DBS", "霰弹枪"));
            weaponRepository.save(new Weapon("Sawed-off", "霰弹枪"));
            
            // 突击步枪
            weaponRepository.save(new Weapon("AKM", "突击步枪"));
            weaponRepository.save(new Weapon("M416", "突击步枪"));
            weaponRepository.save(new Weapon("SCAR-L", "突击步枪"));
            weaponRepository.save(new Weapon("Groza", "突击步枪"));
            weaponRepository.save(new Weapon("QBZ", "突击步枪"));
            weaponRepository.save(new Weapon("AUG A3", "突击步枪"));
            
            // 精确射手步枪
            weaponRepository.save(new Weapon("SKS", "精确射手步枪"));
            weaponRepository.save(new Weapon("Mini 14", "精确射手步枪"));
            weaponRepository.save(new Weapon("QBU", "精确射手步枪"));
            weaponRepository.save(new Weapon("SLR", "精确射手步枪"));
            
            // 狙击枪
            weaponRepository.save(new Weapon("Kar98k", "狙击枪"));
            weaponRepository.save(new Weapon("M24", "狙击枪"));
            weaponRepository.save(new Weapon("AWM", "狙击枪"));
            weaponRepository.save(new Weapon("Win94", "狙击枪"));
            
            // 轻机枪
            weaponRepository.save(new Weapon("DP28", "轻机枪"));
            weaponRepository.save(new Weapon("M249", "轻机枪"));
            
            // 特殊武器
            weaponRepository.save(new Weapon("MK14", "特殊武器"));
            weaponRepository.save(new Weapon("Mk47 Mutant", "特殊武器"));
            
            // 近战武器
            weaponRepository.save(new Weapon("平底锅", "近战武器"));
            weaponRepository.save(new Weapon("撬棍", "近战武器"));
            weaponRepository.save(new Weapon("砍刀", "近战武器"));
            
            // 投掷物
            weaponRepository.save(new Weapon("手雷", "投掷物"));
            weaponRepository.save(new Weapon("烟雾弹", "投掷物"));
            weaponRepository.save(new Weapon("燃烧瓶", "投掷物"));
            weaponRepository.save(new Weapon("震爆弹", "投掷物"));
        }
    }
}