# PUBG武器幸运转盘 - 云服务器部署指南

## 📋 项目概述

这是一个基于Spring Boot的PUBG武器幸运转盘Web应用，已配置为部署在云服务器上。

## 🚀 快速部署

### 前置要求

- **Java 17** 或更高版本
- **云服务器** 具有公网IP (47.94.218.202)
- **MySQL 8.0** 数据库
- **数据库已创建** 并配置了正确的用户权限

### 数据库配置

确保云服务器上的MySQL数据库已正确配置：

```sql
-- 创建数据库用户
CREATE USER 'pubg'@'%' IDENTIFIED BY 'pERkAiyXPwtibWSa';
GRANT ALL PRIVILEGES ON pubg.* TO 'pubg'@'%';
FLUSH PRIVILEGES;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS pubg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 导入数据库结构

在云服务器上运行数据库初始化脚本：

```bash
mysql -u pubg -p'pERkAiyXPwtibWSa' -h localhost pubg < cloud_pubg_database.sql
```

## 📦 部署步骤

### 1. 上传文件到云服务器

将打包好的 `PUBG-0.0.1-SNAPSHOT.jar` 文件上传到云服务器。

### 2. 运行应用

```bash
# 后台运行
nohup java -jar PUBG-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

# 或者直接运行
java -jar PUBG-0.0.1-SNAPSHOT.jar
```

### 3. 验证部署

应用将在端口 **8083** 上运行，可以通过以下方式访问：

```
http://47.94.218.202:8083
```

## 🔧 配置说明

### 数据库配置
- **主机**: 47.94.218.202
- **端口**: 3306 (默认)
- **数据库**: pubg
- **用户名**: pubg
- **密码**: pERkAiyXPwtibWSa

### 应用配置
- **端口**: 8083
- **JPA模式**: validate (使用现有数据库表结构)

## 📊 功能特性

- ✅ 随机武器抽取转盘
- ✅ 多武器类型筛选
- ✅ 抽取历史记录
- ✅ 响应式设计 (适配各种设备)
- ✅ 优化的转盘动画 (3秒内完成)

## 🔍 故障排除

### 数据库连接失败
```bash
# 检查MySQL服务状态
sudo systemctl status mysql

# 检查数据库连接
mysql -u pubg -p'pERkAiyXPwtibWSa' -h localhost pubg -e "SELECT 1"
```

### 端口占用
```bash
# 检查端口占用
netstat -tlnp | grep 8083

# 杀死占用进程
kill -9 <PID>
```

### 查看应用日志
```bash
# 查看实时日志
tail -f app.log

# 查看最近的错误
grep ERROR app.log
```

## 🔄 应用管理

### 重启应用
```bash
# 查找进程
ps aux | grep java

# 杀死进程
kill -9 <PID>

# 重新启动
nohup java -jar PUBG-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

### 更新部署
1. 上传新的JAR文件
2. 停止旧进程
3. 启动新版本

## 📈 性能优化

### JVM参数优化 (可选)
```bash
java -Xms512m -Xmx1024m -XX:+UseG1GC -jar PUBG-0.0.1-SNAPSHOT.jar
```

### 数据库连接池配置 (可选)
在 `application.properties` 中添加：
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

## 🌐 访问地址

部署成功后，通过以下地址访问应用：

**公网地址**: http://47.94.218.202:8083

**API端点**:
- `GET /api/weapons/types` - 获取武器类型
- `POST /api/weapons/by-types` - 根据类型获取武器
- `POST /api/weapons/draw` - 随机抽取武器
- `GET /api/weapons/records` - 获取历史记录
- `DELETE /api/weapons/clear-history` - 清除历史记录
- `GET /api/weapons/statistics` - 获取统计信息

## 📞 技术支持

如遇到部署问题，请检查：
1. Java版本是否为17+
2. 数据库连接是否正常
3. 端口8083是否被占用
4. 防火墙是否开放8083端口

---

**部署包信息**:
- 文件名: `PUBG-0.0.1-SNAPSHOT.jar`
- 大小: 44.6 MB
- 类型: Spring Boot 可执行JAR
- 端口: 8083
