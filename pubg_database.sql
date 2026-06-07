-- 创建数据库
CREATE DATABASE IF NOT EXISTS pubg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE pubg;

-- 创建武器表
CREATE TABLE IF NOT EXISTS weapons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建抽取记录表
CREATE TABLE IF NOT EXISTS draw_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    weapon_name VARCHAR(255) NOT NULL,
    weapon_type VARCHAR(255) NOT NULL,
    draw_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入手枪数据
INSERT INTO weapons (name, type) VALUES
('P92', '手枪'),
('P1911', '手枪'),
('R1895', '手枪'),
('P18C', '手枪'),
('蝎式手枪', '手枪'),
('信号枪', '手枪');

-- 插入冲锋枪数据
INSERT INTO weapons (name, type) VALUES
('Micro UZI', '冲锋枪'),
('UMP45', '冲锋枪'),
('Vector', '冲锋枪'),
('汤姆逊冲锋枪', '冲锋枪'),
('MP5K', '冲锋枪'),
('PP-19 Bizon', '冲锋枪');

-- 插入霰弹枪数据
INSERT INTO weapons (name, type) VALUES
('S1897', '霰弹枪'),
('S686', '霰弹枪'),
('S12K', '霰弹枪'),
('DBS', '霰弹枪'),
('O12', '霰弹枪');

-- 插入突击步枪数据
INSERT INTO weapons (name, type) VALUES
('AKM', '突击步枪'),
('M16A4', '突击步枪'),
('M416', '突击步枪'),
('SCAR-L', '突击步枪'),
('Beryl M762', '突击步枪'),
('G36C', '突击步枪'),
('QBZ', '突击步枪'),
('AUG A3', '突击步枪'),
('Groza', '突击步枪');

-- 插入精确射手步枪数据
INSERT INTO weapons (name, type) VALUES
('Mini 14', '精确射手步枪'),
('SKS', '精确射手步枪'),
('SLR', '精确射手步枪'),
('QBU', '精确射手步枪'),
('MK12', '精确射手步枪'),
('Mk14', '精确射手步枪');

-- 插入狙击枪数据
INSERT INTO weapons (name, type) VALUES
('Kar98k', '狙击枪'),
('M24', '狙击枪'),
('Win94', '狙击枪'),
('莫辛-纳甘', '狙击枪'),
('AWM', '狙击枪'),
('AMR', '狙击枪');

-- 插入轻机枪数据
INSERT INTO weapons (name, type) VALUES
('DP-28', '轻机枪'),
('M249', '轻机枪'),
('MG3', '轻机枪');

-- 插入特殊武器数据
INSERT INTO weapons (name, type) VALUES
('十字弩', '特殊武器'),
('铁拳火箭筒', '特殊武器'),
('迫击炮', '特殊武器'),
('M79榴弹发射器', '特殊武器'),
('C4', '特殊武器'),
('尖刺陷阱', '特殊武器'),
('防爆盾', '特殊武器');

-- 插入近战武器数据
INSERT INTO weapons (name, type) VALUES
('撬棍', '近战武器'),
('大砍刀', '近战武器'),
('镰刀', '近战武器'),
('平底锅', '近战武器');

-- 插入投掷物数据
INSERT INTO weapons (name, type) VALUES
('破片手榴弹', '投掷物'),
('烟雾弹', '投掷物'),
('震撼弹', '投掷物'),
('燃烧瓶', '投掷物');

-- 创建索引以提高查询性能
CREATE INDEX idx_weapon_type ON weapons(type);
CREATE INDEX idx_draw_time ON draw_records(draw_time);