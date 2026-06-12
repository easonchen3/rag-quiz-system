# ============================================
#  RAG Quiz - Windows 一键构建脚本
#  用法: .\build.ps1
#  输出: rag-quiz-deploy.zip
# ============================================
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$ProjectDir = $PSScriptRoot
$BuildDir   = Join-Path $ProjectDir "build"
$PkgDir     = Join-Path $BuildDir "rag-quiz"
$ZipFile    = Join-Path $ProjectDir "rag-quiz-deploy.zip"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RAG Quiz - Build (Windows)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Clean
if (Test-Path $BuildDir) { Remove-Item $BuildDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $PkgDir | Out-Null

# ---- 1. Install & bundle backend ----
Write-Host "[1/3] Bundle backend..." -ForegroundColor Green
Set-Location (Join-Path $ProjectDir "backend")
npm install --production | Out-Null
npm install esbuild --save-dev | Out-Null

# Bundle server.js -> single file, externalize node:sqlite
npx esbuild server.js --bundle --platform=node --format=cjs `
  --external:node:sqlite `
  --outfile=(Join-Path $PkgDir "server.js")

# Copy questions data
Copy-Item (Join-Path $ProjectDir "backend\questions.js") $PkgDir

Write-Host "  Done" -ForegroundColor Green

# ---- 2. Build frontend ----
Write-Host "[2/3] Build frontend..." -ForegroundColor Green
Set-Location (Join-Path $ProjectDir "frontend")
npm install | Out-Null
npm run build | Out-Null

Copy-Item (Join-Path $ProjectDir "frontend\dist") (Join-Path $PkgDir "frontend") -Recurse
Write-Host "  Done" -ForegroundColor Green

# ---- 3. Create package ----
Write-Host "[3/3] Package..." -ForegroundColor Green

# start.sh
@'
#!/bin/bash
# RAG Quiz - Start Script
# Usage: chmod +x start.sh && sudo ./start.sh
set -e

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== RAG Quiz ==="

if ! command -v node &>/dev/null; then
    echo "Need Node.js 22+"
    exit 1
fi

# start backend with PM2
cd "$DEPLOY_DIR"
mkdir -p logs

if ! command -v pm2 &>/dev/null; then
    npm install -g pm2
fi

pm2 delete rag-quiz-backend 2>/dev/null || true
pm2 start server.js --name rag-quiz-backend --cwd "$DEPLOY_DIR" \
    --error logs/err.log --output logs/out.log \
    --max-memory-restart 256M

# nginx
NGINX_HOST=$(grep -oP 'server_name\s+\K\S+' nginx.conf | head -1)
sed "s|root /opt/rag-quiz/frontend/dist|root $DEPLOY_DIR/frontend|" nginx.conf | \
sudo tee /etc/nginx/conf.d/rag-quiz.conf > /dev/null

if sudo nginx -t 2>/dev/null; then
    sudo nginx -s reload 2>/dev/null || sudo systemctl reload nginx
    echo "Nginx reloaded"
else
    echo "Check nginx: sudo nginx -t"
fi

echo "Done. Visit http://<server>/rag-quiz/"
'@ | Out-File -FilePath (Join-Path $PkgDir "start.sh") -Encoding ascii

# nginx.conf
Copy-Item (Join-Path $ProjectDir "nginx.conf") $PkgDir

# Zip
Set-Location $BuildDir
if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }
Compress-Archive -Path "rag-quiz" -DestinationPath $ZipFile -Force

# Done
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Build complete" -ForegroundColor Green
Write-Host ""
Write-Host "  Output: $ZipFile"
Write-Host ""
Write-Host "  Deploy:"
Write-Host "    1. Upload rag-quiz-deploy.zip to server"
Write-Host "    2. unzip rag-quiz-deploy.zip -d /home/"
Write-Host "    3. cd /home/rag-quiz && chmod +x start.sh"
Write-Host "    4. sudo ./start.sh"
Write-Host "============================================" -ForegroundColor Cyan

Set-Location $ProjectDir
