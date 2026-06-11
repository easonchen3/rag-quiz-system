#!/bin/bash
# RAG Quiz - 开发模式启动 (Linux)
# 用法: chmod +x dev.sh && ./dev.sh
# 同时启动后端(3001)和前端热更新开发服务器(5173)，Ctrl+C 停止全部

set -e
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "正在停止服务..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
  echo "已停止"
  exit 0
}
trap cleanup SIGINT SIGTERM

# 安装依赖 (首次)
if [ ! -d "$PROJECT_DIR/backend/node_modules" ]; then
  echo "[init] 安装后端依赖..."
  cd "$PROJECT_DIR/backend" && npm install
fi
if [ ! -d "$PROJECT_DIR/frontend/node_modules" ]; then
  echo "[init] 安装前端依赖..."
  cd "$PROJECT_DIR/frontend" && npm install
fi

# 启动后端
echo "[backend] 启动后端开发服务器 → http://localhost:3001"
cd "$PROJECT_DIR/backend"
node server.js &
BACKEND_PID=$!

# 启动前端
echo "[frontend] 启动前端开发服务器 → http://localhost:5173"
cd "$PROJECT_DIR/frontend"
npx vite --host &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:3001"
echo "  API:  http://localhost:3001/api/questions"
echo "  按 Ctrl+C 停止全部"
echo "============================================"

wait
