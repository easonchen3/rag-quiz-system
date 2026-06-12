# ============================================
#  RAG Quiz - Windows 打包构建脚本
#  用法: .\build.ps1
#  输出: rag-quiz-deploy.zip (可直接上传到 Linux 部署)
# ============================================
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$ProjectDir = $PSScriptRoot
$BuildDir = Join-Path $ProjectDir "build"
$PackageDir = Join-Path $BuildDir "rag-quiz"
$ZipFile = Join-Path $ProjectDir "rag-quiz-deploy.zip"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RAG Quiz - Windows 打包构建" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 清理旧的构建
if (Test-Path $BuildDir) { Remove-Item $BuildDir -Recurse -Force }

# ---- Step 1: 安装后端依赖 ----
Write-Host "[1/4] 安装后端依赖..." -ForegroundColor Green
Set-Location (Join-Path $ProjectDir "backend")
npm install --production
Write-Host "  Done" -ForegroundColor Green

# ---- Step 2: 构建前端 ----
Write-Host "[2/4] 构建前端..." -ForegroundColor Green
Set-Location (Join-Path $ProjectDir "frontend")
npm install
npm run build
Write-Host "  Done" -ForegroundColor Green

# ---- Step 3: 组装发布包 ----
Write-Host "[3/4] 组装发布包..." -ForegroundColor Green

# Create package directories
New-Item -ItemType Directory -Force -Path (Join-Path $PackageDir "backend") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $PackageDir "logs") | Out-Null

# Copy backend (with node_modules)
Copy-Item (Join-Path $ProjectDir "backend\server.js") (Join-Path $PackageDir "backend\")
Copy-Item (Join-Path $ProjectDir "backend\questions.js") (Join-Path $PackageDir "backend\")
Copy-Item (Join-Path $ProjectDir "backend\package.json") (Join-Path $PackageDir "backend\")
Copy-Item (Join-Path $ProjectDir "backend\node_modules") (Join-Path $PackageDir "backend\node_modules") -Recurse

# Copy frontend dist
Copy-Item (Join-Path $ProjectDir "frontend\dist") (Join-Path $PackageDir "frontend") -Recurse

# Copy nginx config
Copy-Item (Join-Path $ProjectDir "nginx.conf") $PackageDir

# Generate ecosystem.config.cjs for PM2
@"
// PM2 process config
module.exports = {
  apps: [{
    name: "rag-quiz-backend",
    script: "./backend/server.js",
    cwd: __dirname,
    instances: 1,
    exec_mode: "fork",
    env: { NODE_ENV: "production", PORT: 3001 },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    max_memory_restart: "256M",
    restart_delay: 3000
  }]
};
"@ | Out-File -FilePath (Join-Path $PackageDir "ecosystem.config.cjs") -Encoding UTF8

# Generate start.sh (Linux server auto-deploy)
@"
#!/bin/bash
# ============================================
#  RAG Quiz - 一键启动脚本
#  用法: chmod +x start.sh && sudo ./start.sh
# ============================================
set -e

DEPLOY_DIR="/home/rag-quiz"
RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "`${GREEN}[INFO]`${NC} `$1"; }
warn() { echo -e "`${RED}[WARN]`${NC} `$1"; }

echo -e "`${CYAN}"
echo "============================================"
echo "  RAG Quiz - 一键启动"
echo "============================================"
echo -e "`${NC}"

if ! command -v node &>/dev/null; then
    warn "Need Node.js 22+"
    echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VER=`$(node -v | sed 's/v//' | cut -d. -f1)
if [ "`$NODE_VER" -lt 22 ]; then
    warn "Node.js too old (`$(node -v)), need >= 22"
    exit 1
fi
log "Node.js `$(node -v)"

mkdir -p "`${DEPLOY_DIR}/logs"
mkdir -p "`${DEPLOY_DIR}/backend/data"

log "Starting backend..."
cd "`${DEPLOY_DIR}"

if ! command -v pm2 &>/dev/null; then
    log "Installing PM2..."
    npm install -g pm2
fi

pm2 delete rag-quiz-backend 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

log "Configuring Nginx..."
sed "s|/opt/rag-quiz|`${DEPLOY_DIR}|g" "`${DEPLOY_DIR}/nginx.conf" | sudo tee /etc/nginx/conf.d/rag-quiz.conf > /dev/null

if sudo nginx -t 2>/dev/null; then
    sudo nginx -s reload 2>/dev/null || sudo systemctl reload nginx
    log "Nginx reloaded"
else
    warn "Nginx config error, run: sudo nginx -t"
fi

pm2 startup systemd -u "`$(whoami)" --hp "`$HOME" 2>/dev/null || true

echo ""
echo -e "`${CYAN}============================================${NC}"
echo -e "`${GREEN}  Started${NC}"
echo "  http://<server>/rag-quiz/"
echo "  http://<server>/rag-quiz/api/results"
echo -e "`${CYAN}============================================${NC}"
"@ | Out-File -FilePath (Join-Path $PackageDir "start.sh") -Encoding ascii

Write-Host "  Done" -ForegroundColor Green

# ---- Step 4: 打包 ----
Write-Host "[4/4] 创建压缩包..." -ForegroundColor Green
Set-Location $BuildDir
if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }
Compress-Archive -Path "rag-quiz" -DestinationPath $ZipFile -Force

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  构建完成" -ForegroundColor Green
Write-Host ""
Write-Host "  输出文件: $ZipFile" -ForegroundColor White
Write-Host ""
Write-Host "  部署步骤:" -ForegroundColor Cyan
Write-Host "  1. 上传 rag-quiz-deploy.zip 到 Linux 服务器" -ForegroundColor White
Write-Host "  2. unzip rag-quiz-deploy.zip -d /home/" -ForegroundColor White
Write-Host "  3. cd /home/rag-quiz && chmod +x start.sh" -ForegroundColor White
Write-Host "  4. sudo ./start.sh" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

Set-Location $ProjectDir
