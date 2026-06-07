@echo off
title PUBG武器幸运转盘部署脚本

echo ========================================
echo   PUBG武器幸运转盘部署脚本
echo ========================================
echo.

REM 检查Java是否安装
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Java运行环境!
    echo 请先安装Java 17或更高版本
    echo.
    pause
    exit /b 1
)

REM 检查Maven是否安装
mvn -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Maven!
    echo 请先安装Maven 3.6或更高版本
    echo.
    pause
    exit /b 1
)

echo 检测到所需环境:
java -version
echo.
mvn -v
echo.

echo 开始部署PUBG武器幸运转盘应用...
echo.

REM 清理并编译项目
echo 正在清理并编译项目...
mvn clean compile
if %errorlevel% neq 0 (
    echo.
    echo 错误: 项目编译失败!
    echo.
    pause
    exit /b 1
)
echo 项目编译完成!
echo.

REM 打包应用
echo 正在打包应用...
mvn package -DskipTests
if %errorlevel% neq 0 (
    echo.
    echo 错误: 应用打包失败!
    echo.
    pause
    exit /b 1
)

REM 检查jar包是否生成成功
if not exist "target\PUBG-0.0.1-SNAPSHOT.jar" (
    echo.
    echo 错误: JAR包未生成，请检查构建过程
    echo.
    pause
    exit /b 1
)

echo 应用打包完成!
echo.

REM 启动应用（使用cloud配置文件）
echo 正在启动应用...
start "PUBG应用" /min cmd /c "java -jar -Dspring.profiles.active=cloud target\PUBG-0.0.1-SNAPSHOT.jar > app.log 2>&1"

echo.
echo 应用已在后台启动!
echo 日志文件: app.log
echo 应用访问地址: http://47.94.218.202:8083
echo.
echo 按任意键关闭此窗口...
pause >nul