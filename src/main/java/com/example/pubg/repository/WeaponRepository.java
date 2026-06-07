package com.example.pubg.repository;

import com.example.pubg.model.Weapon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Long> {
    List<Weapon> findByTypeIn(List<String> types);
}