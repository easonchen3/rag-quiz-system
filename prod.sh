#!/bin/bash
# RAG Quiz - 生产模式启动 (Linux)
# 用法: chmod +x prod.sh && ./prod.sh
# 构建前端 + PM2 启动后端 + 输出 Nginx 配置指引

set -e
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  RAG Quiz - 生产部署"
echo "============================================"
echo ""

# 1. 安装后端依赖
echo "[1/4] 安装后端依赖..."
cd "$PROJECT_DIR/backend"
npm install --production

# 2. 构建前端
echo "[2/4] 构建前端..."
cd "$PROJECT_DIR/frontend"
npm install
npm run build
echo "  输出目录: $PROJECT_DIR/frontend/dist"

# 3. 创建日志目录
mkdir -p "$PROJECT_DIR/logs"

# 4. 启动后端
echo "[3/4] 启动后端服务..."
cd "$PROJECT_DIR"

if command -v pm2 &> /dev/null; then
    pm2 delete rag-quiz-backend 2>/dev/null || true
    pm2 start ecosystem.config.cjs
    pm2 save
    echo "  后端已通过 PM2 守护启动"
else
    echo "  PM2 未安装，使用 nohup 启动 (不推荐用于生产)"
    nohup node "$PROJECT_DIR/backend/server.js" > "$PROJECT_DIR/logs/out.log" 2>&1 &
    echo "  后端 PID: $!"
fi

# 5. Nginx 配置提示
echo "[4/4] Nginx 配置"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
NGINX_CONFD="/etc/nginx/conf.d"

if [ -d "$NGINX_CONFD" ]; then
    TARGET="$NGINX_CONFD/rag-quiz.conf"
elif [ -d "$NGINX_AVAILABLE" ]; then
    TARGET="$NGINX_AVAILABLE/rag-quiz.conf"
else
    TARGET=""
fi

if [ -n "$TARGET" ]; then
    cp "$PROJECT_DIR/nginx.conf" "$TARGET"
    if [ -d "$NGINX_ENABLED" ]; then
        ln -sf "$TARGET" "$NGINX_ENABLED/rag-quiz.conf" 2>/dev/null || true
    fi
    echo "  已复制到: $TARGET"
    echo "  执行: nginx -t && nginx -s reload"
fi

echo ""
echo "============================================"
echo "  部署完成"
echo ""
echo "  访问: http://<服务器IP>"
echo "  后台: http://<服务器IP>/api/results"
echo ""
echo "  PM2 管理:"
echo "    pm2 status"
echo "    pm2 logs rag-quiz-backend"
echo "    pm2 restart rag-quiz-backend"
echo "============================================"
