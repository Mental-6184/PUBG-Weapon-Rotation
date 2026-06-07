package com.example.pubg.model;

import jakarta.persistence.*;

@Entity
@Table(name = "weapons")
public class Weapon implements Comparable<Weapon> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;                                    
    @Column(nullable = false)
    private String type;
    
    // Constructors
    public Weapon() {}
    
    public Weapon(String name, String type) {
        this.name = name;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    @Override
    public int compareTo(Weapon other) {
        if (other == null) return 1;
        
        // 先按类型排序
        int typeComparison = this.type.compareTo(other.type);
        if (typeComparison != 0) {
            return typeComparison;
        }
        
        // 再按名称排序
        return this.name.compareTo(other.name);
    }
}