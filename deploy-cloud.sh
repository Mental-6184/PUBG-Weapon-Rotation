#!/bin/bash

# PUBG武器幸运转盘 - 云服务器自动部署脚本
# 使用方法: chmod +x deploy-cloud.sh && ./deploy-cloud.sh

echo "🚀 开始部署 PUBG 武器幸运转盘到云服务器..."

# 检查Java环境
echo "📋 检查Java环境..."
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到Java，请先安装Java 17+"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ 错误: Java版本过低，需要Java 17+，当前版本: $JAVA_VERSION"
    exit 1
fi

echo "✅ Java $JAVA_VERSION 环境检查通过"

# 检查JAR文件
JAR_FILE="PUBG-0.0.1-SNAPSHOT.jar"
if [ ! -f "$JAR_FILE" ]; then
    echo "❌ 错误: 未找到 $JAR_FILE 文件"
    exit 1
fi

echo "✅ 找到部署包: $JAR_FILE"

# 停止现有应用
echo "🛑 停止现有应用..."
PID=$(ps aux | grep "$JAR_FILE" | grep -v grep | awk '{print $2}')
if [ ! -z "$PID" ]; then
    echo "发现运行中的应用 (PID: $PID)，正在停止..."
    kill -9 $PID
    sleep 3
fi

# 备份旧日志
if [ -f "app.log" ]; then
    mv app.log app.log.backup.$(date +%Y%m%d_%H%M%S)
fi

# 启动应用
echo "🎯 启动应用..."
echo "应用将在端口 8083 上运行..."
echo "日志文件: app.log"
echo ""

nohup java -jar $JAR_FILE > app.log 2>&1 &

# 等待启动
echo "⏳ 等待应用启动..."
sleep 10

# 检查是否启动成功
if ps aux | grep "$JAR_FILE" | grep -v grep > /dev/null; then
    echo "✅ 应用启动成功!"
    echo ""
    echo "🌐 访问地址: http://47.94.218.202:8083"
    echo "📊 API文档: http://47.94.218.202:8083/api/weapons/types"
    echo ""
    echo "📝 查看日志: tail -f app.log"
    echo "🛑 停止应用: kill \$(ps aux | grep '$JAR_FILE' | grep -v grep | awk '{print \$2}')"
else
    echo "❌ 应用启动失败，请检查日志: cat app.log"
    exit 1
fi

echo ""
echo "🎉 部署完成！"
