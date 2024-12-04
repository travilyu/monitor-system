#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR="$SCRIPT_DIR/server"
UI_DIR="$SCRIPT_DIR/ui"
SERVER_DIST="$SERVER_DIR/dist/index.js"
UI_DIST="$UI_DIR/dist"
PROXY_SERVER="$SCRIPT_DIR/server.js"

# 日志文件路径
LOG_DIR="$SCRIPT_DIR/logs"
SERVER_LOG="$LOG_DIR/monitor.log"
PROXY_LOG="$LOG_DIR/monitor_access.log"

# 创建日志目录
mkdir -p "$LOG_DIR"

# PID 文件路径
PID_DIR="$SCRIPT_DIR/pids"
SERVER_PID="$PID_DIR/server.pid"
PROXY_PID="$PID_DIR/proxy.pid"

# 创建 PID 目录
mkdir -p "$PID_DIR"

# 帮助信息
usage() {
    echo "Usage: $0 [-s|--server] [-u|--ui] [-h|--help]"
    echo "  -s, --server   重启后端服务"
    echo "  -u, --ui      重启前端服务"
    echo "  -h, --help    显示帮助信息"
    exit 1
}

# 重启后端服务
restart_server() {
    echo -e "${GREEN}重启后端服务...${NC}"

    cd "$SERVER_DIR" || exit 1

    # 构建后端
    echo "构建后端..."
    npm install
    npm run build

    if [ $? -ne 0 ]; then
        echo -e "${RED}后端构建失败${NC}"
        exit 1
    fi

    # 停止现有进程
    if [ -f "$SERVER_PID" ]; then
        echo "停止现有后端进程..."
        kill -9 $(cat "$SERVER_PID") 2>/dev/null || true
        rm "$SERVER_PID"
    fi

    # 启动新进程
    echo "启动新的后端进程..."
    nohup node "$SERVER_DIST" >> "$SERVER_LOG" 2>&1 & echo $! > "$SERVER_PID"

    echo -e "${GREEN}后端服务重启完成${NC}"
}

# 重启前端服务
restart_ui() {
    echo -e "${GREEN}重启前端服务...${NC}"

    # 构建前端
    cd "$UI_DIR" || exit 1
    echo "构建前端..."
    npm install
    npm run build

    if [ $? -ne 0 ]; then
        echo -e "${RED}前端构建失败${NC}"
        exit 1
    fi

    # 返回根目录
    cd "$SCRIPT_DIR" || exit 1

    # 安装根目录依赖
    npm install

    # 停止现有进程
    if [ -f "$PROXY_PID" ]; then
        echo "停止现有前端代理进程..."
        kill -9 $(cat "$PROXY_PID") 2>/dev/null || true
        rm "$PROXY_PID"
    fi

    # 启动新进程
    echo "启动新的前端代理进程..."
    nohup node "$PROXY_SERVER" >> "$PROXY_LOG" 2>&1 & echo $! > "$PROXY_PID"

    echo -e "${GREEN}前端服务重启完成${NC}"
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--server)
            restart_server
            shift
            ;;
        -u|--ui)
            restart_ui
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "未知参数: $1"
            usage
            ;;
    esac
done

# 如果没有参数，显示帮助信息
if [ $# -eq 0 ]; then
    usage
fi

echo -e "${GREEN}重启完成！${NC}"