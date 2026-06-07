#!/bin/bash

# PUBG 武器幸运转盘 - 启动脚本
# 使用方法: chmod +x start-app.sh && ./start-app.sh

echo "🎮 启动 PUBG 武器幸运转盘..."

JAR_FILE="PUBG-0.0.1-SNAPSHOT.jar"

if [ ! -f "$JAR_FILE" ]; then
    echo "❌ 错误: 未找到 $JAR_FILE 文件"
    exit 1
fi

echo "📦 使用部署包: $JAR_FILE"
echo "🚀 启动应用 (端口: 8083)..."
echo ""

# 启动应用
java -jar $JAR_FILE

echo ""
echo "🛑 应用已停止"
