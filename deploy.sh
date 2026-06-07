#!/bin/bash

# PUBG武器幸运转盘部署脚本

echo "开始部署PUBG武器幸运转盘应用..."

# 1. 清理并编译项目
echo "正在清理并编译项目..."
mvn clean compile

# 2. 打包应用
echo "正在打包应用..."
mvn package -DskipTests

# 3. 检查jar包是否生成成功
if [ ! -f "target/PUBG-0.0.1-SNAPSHOT.jar" ]; then
    echo "错误: JAR包未生成，请检查构建过程"
    exit 1
fi

echo "应用打包完成!"

# 4. 启动应用（使用cloud配置文件）
echo "正在启动应用..."
nohup java -jar -Dspring.profiles.active=cloud target/PUBG-0.0.1-SNAPSHOT.jar > app.log 2>&1 &

echo "应用已在后台启动!"
echo "您可以使用以下命令查看日志: tail -f app.log"
echo "应用访问地址: http://47.94.218.202:8083"