@echo off
REM PUBG 武器幸运转盘 - Windows启动脚本

echo 🎮 启动 PUBG 武器幸运转盘...
echo.

set JAR_FILE=PUBG-0.0.1-SNAPSHOT.jar

if not exist "%JAR_FILE%" (
    echo ❌ 错误: 未找到 %JAR_FILE% 文件
    pause
    exit /b 1
)

echo 📦 使用部署包: %JAR_FILE%
echo 🚀 启动应用 (端口: 8083)...
echo 访问地址: http://47.94.218.202:8083
echo 按 Ctrl+C 停止应用
echo.

java -jar %JAR_FILE%

echo.
echo 🛑 应用已停止
pause
