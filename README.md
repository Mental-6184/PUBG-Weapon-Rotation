# PUBG 武器幸运转盘 🎯

一个基于 **Spring Boot** + **原生前端**（HTML/CSS/JavaScript）的 PUBG 武器随机抽取 Web 应用。用户可以选择武器类型，通过转盘动画随机抽取 PUBG 武器，并查看抽取历史记录。

## 功能特性

- **武器分类选择** — 按类型筛选 PUBG 武器，支持全选/清空
- **动画转盘抽取** — Canvas 绘制的可视化转盘，平滑旋转动画，精确结果计算
- **抽取历史记录** — 记录每次抽取结果与时间戳，支持清除历史
- **音效反馈** — 旋转音效 + 结束音效，支持开关控制
- **响应式设计** — 适配桌面端与移动端

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Spring Boot 3.1.0, Java 17, Spring Data JPA |
| 前端 | HTML5, CSS3, JavaScript (ES6+), Canvas API |
| 数据库 | MySQL 8.0 |
| 构建 | Maven |

## 快速开始

### 前置要求

- Java 17+
- MySQL 8.0
- Maven 3.6+

### 1. 初始化数据库

```sql
CREATE DATABASE IF NOT EXISTS pubg CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后导入数据库脚本：

```bash
mysql -u root -p pubg < pubg_database.sql
```

### 2. 配置数据库连接

编辑 `src/main/resources/application.properties`，修改数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pubg?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password_here
```

### 3. 启动应用

```bash
# 开发模式
mvn spring-boot:run

# 或打包后运行
mvn package -DskipTests
java -jar target/PUBG-0.0.1-SNAPSHOT.jar
```

访问 [http://localhost:8083](http://localhost:8083)

## 项目结构

```
PUBG/
├── src/
│   ├── main/
│   │   ├── java/com/example/pubg/
│   │   │   ├── config/          # 配置类（CORS、数据初始化）
│   │   │   ├── controller/      # REST API 控制器
│   │   │   ├── model/           # 数据实体（Weapon、DrawRecord）
│   │   │   ├── repository/      # JPA 数据访问层
│   │   │   ├── service/         # 业务逻辑层
│   │   │   └── PubgApplication.java  # 应用入口
│   │   └── resources/
│   │       ├── static/          # 前端静态文件（index.html, script.js, styles.css）
│   │       └── application.properties  # 应用配置
│   └── test/
├── pubg_database.sql            # 本地数据库初始化脚本
├── cloud_pubg_database.sql      # 云服务器数据库脚本
├── deploy.bat / deploy.sh       # 部署脚本
├── start-app.bat / start-app.sh # 启动脚本
├── deploy-cloud.sh              # 云服务器部署脚本
├── DEPLOYMENT_README.md         # 云部署详细指南
├── pom.xml                      # Maven 构建配置
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/weapons/types` | 获取所有武器类型 |
| POST | `/api/weapons/by-types` | 根据类型获取武器列表 |
| POST | `/api/weapons/draw` | 随机抽取武器 |
| GET | `/api/weapons/records` | 获取抽取历史记录 |
| DELETE | `/api/weapons/clear-history` | 清除所有历史记录 |
| GET | `/api/weapons/statistics` | 获取统计信息 |

## 数据库设计

### weapons — 武器表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT (PK) | 武器唯一标识 |
| name | VARCHAR(255) | 武器名称 |
| type | VARCHAR(255) | 武器类型 |
| created_at | TIMESTAMP | 创建时间 |

### draw_records — 抽取记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT (PK) | 记录唯一标识 |
| weapon_name | VARCHAR(255) | 抽取的武器名称 |
| weapon_type | VARCHAR(255) | 抽取的武器类型 |
| draw_time | TIMESTAMP | 抽取时间 |

## 云服务器部署

详细部署指南请参阅 [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)。

快速部署：

```bash
# Linux
chmod +x deploy-cloud.sh
./deploy-cloud.sh

# 或手动
java -jar PUBG-0.0.1-SNAPSHOT.jar --server.port=8083
```

## 许可证

MIT License

> **声明：** PUBG 是 Krafton, Inc. 的注册商标。本项目仅供学习参考，与 PUBG 官方无任何关联。
