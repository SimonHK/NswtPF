#!/bin/sh

#echo "设置,JAVA与MAVEN环境"
#JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home/jre"
#M2_HOME="/usr/local/maven3.3.9"
#echo "设置完成!"

echo "进人工作目录"
cd $1
echo $1

echo "执行maven命令,查看maven版本"
mvn $2
echo "执行完毕"
