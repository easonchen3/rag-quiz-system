#!/bin/bash
# ============================================
#  RAG Quiz - 一键部署脚本 (Linux)
#  用法: chmod +x deploy.sh && sudo ./deploy.sh
# ============================================
set -e

DEPLOY_DIR="/opt/rag-quiz"
REPO_URL="git@github.com:easonchen3/rag-quiz-system.git"
NODE_MIN_VER=22

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${RED}[WARN]${NC} $1"; }

echo -e "${CYAN}"
echo "============================================"
echo "  RAG 知识挑战赛 - 一键部署"
echo "============================================"
echo -e "${NC}"

# ---- 检查 Node.js 版本 ----
log "检查 Node.js 环境..."
if ! command -v node &>/dev/null; then
    warn "未安装 Node.js，请先安装 Node.js 22+"
    echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi
NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt $NODE_MIN_VER ]; then
    warn "Node.js 版本过低 ($(node -v))，需要 >= $NODE_MIN_VER (内置 sqlite 模块)"
    exit 1
fi
log "Node.js $(node -v) ✓"

# ---- 拉取/更新代码 ----
if [ -d "$DEPLOY_DIR/.git" ]; then
    log "更新已有仓库..."
    cd "$DEPLOY_DIR"
    git pull origin main
else
    log "克隆仓库..."
    sudo mkdir -p "$DEPLOY_DIR"
    sudo chown -R "$(whoami)" "$DEPLOY_DIR"
    git clone "$REPO_URL" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# ---- 安装后端依赖 ----
log "安装后端依赖..."
cd "$DEPLOY_DIR/backend"
npm install --production

# ---- 构建前端 ----
log "构建前端..."
cd "$DEPLOY_DIR/frontend"
npm install
npm run build

# ---- 创建目录 ----
mkdir -p "$DEPLOY_DIR/logs"

# ---- 启动后端 (PM2) ----
log "启动后端服务..."
cd "$DEPLOY_DIR"

if ! command -v pm2 &>/dev/null; then
    log "安装 PM2..."
    npm install -g pm2
fi

pm2 delete rag-quiz-backend 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>/dev/null || true

log "后端已启动 (PM2)"

# ---- 配置 Nginx ----
log "配置 Nginx..."

NGINX_CONF="/etc/nginx/conf.d/rag-quiz.conf"
sudo cp "$DEPLOY_DIR/nginx.conf" "$NGINX_CONF"

# 测试并重载 Nginx
if sudo nginx -t 2>/dev/null; then
    sudo nginx -s reload 2>/dev/null || sudo systemctl reload nginx
    log "Nginx 已重载 ✓"
else
    warn "Nginx 配置测试失败，请检查后手动重载"
fi

# ---- 完成 ----
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo ""
echo "  前端入口:  http://<服务器IP>/rag-quiz/"
echo "  成绩查询:  http://<服务器IP>/rag-quiz/api/results"
echo "  健康检查:  http://<服务器IP>/rag-quiz/api/health"
echo ""
echo "  PM2 管理:"
echo "    pm2 status"
echo "    pm2 logs rag-quiz-backend"
echo "    pm2 restart rag-quiz-backend"
echo ""
echo "  数据库位置: $DEPLOY_DIR/backend/data/quiz.db"
echo "  日志位置:   $DEPLOY_DIR/logs/"
echo -e "${CYAN}============================================${NC}"
