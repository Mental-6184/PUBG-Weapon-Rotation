package com.example.pubg.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "draw_records")
public class DrawRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String weaponName;
    
    @Column(nullable = false)
    private String weaponType;
    
    @Column(nullable = false)
    private LocalDateTime drawTime;
    
    // Constructors
    public DrawRecord() {}
    
    public DrawRecord(String weaponName, String weaponType) {
        this.weaponName = weaponName;
        this.weaponType = weaponType;
        this.drawTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getWeaponName() {
        return weaponName;
    }
    
    public void setWeaponName(String weaponName) {
        this.weaponName = weaponName;
    }
    
    public String getWeaponType() {
        return weaponType;
    }
    
    public void setWeaponType(String weaponType) {
        this.weaponType = weaponType;
    }
    
    public LocalDateTime getDrawTime() {
        return drawTime;
    }
    
    public void setDrawTime(LocalDateTime drawTime) {
        this.drawTime = drawTime;
    }
}