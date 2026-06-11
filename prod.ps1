# RAG Quiz - Production Deploy (Windows)
# Usage: powershell -ExecutionPolicy Bypass -File prod.ps1
# Builds frontend + starts backend via PM2 or background job

$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RAG Quiz - PROD DEPLOY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Install backend deps
Write-Host "[1/4] Installing backend deps..." -ForegroundColor Yellow
Set-Location "$ProjectDir\backend"
npm install --production

# 2. Build frontend
Write-Host "[2/4] Building frontend..." -ForegroundColor Yellow
Set-Location "$ProjectDir\frontend"
npm install
npm run build
Write-Host "  Output: $ProjectDir\frontend\dist" -ForegroundColor Green

# 3. Create log dir
New-Item -ItemType Directory -Force -Path "$ProjectDir\logs" -ErrorAction SilentlyContinue | Out-Null

# 4. Start backend
Write-Host "[3/4] Starting backend -> http://localhost:3001" -ForegroundColor Yellow

$pm2Available = Get-Command pm2 -ErrorAction SilentlyContinue

if ($pm2Available) {
    pm2 delete rag-quiz-backend 2>$null
    Set-Location $ProjectDir
    pm2 start ecosystem.config.cjs
    pm2 save
    Write-Host "  Backend started via PM2" -ForegroundColor Green
} else {
    Write-Host "  PM2 not found, starting as background job..." -ForegroundColor Yellow
    Write-Host "  Tip: npm install -g pm2" -ForegroundColor Yellow
    Start-Job -Name "rag-quiz-backend" -ArgumentList $ProjectDir -ScriptBlock {
        param($dir)
        Set-Location $dir
        node "$dir\backend\server.js"
    } | Out-Null
    Write-Host "  Backend running (Job: rag-quiz-backend)" -ForegroundColor Green
    Write-Host "  Check: Get-Job -Name rag-quiz-backend" -ForegroundColor White
}

# 5. Nginx config hint
Write-Host "[4/4] Nginx config" -ForegroundColor Yellow

Write-Host ""
Write-Host "--- Add this to your nginx.conf server block ---"
Write-Host ""
Write-Host "    root $ProjectDir\frontend\dist;" 
Write-Host "    index index.html;"
Write-Host ""
Write-Host "    location /api/ {"
Write-Host "        proxy_pass http://127.0.0.1:3001;"
Write-Host "        proxy_set_header Host $host;"
Write-Host "        proxy_set_header X-Real-IP $remote_addr;"
Write-Host "    }"
Write-Host ""
Write-Host "    location / {"
Write-Host "        try_files $uri $uri/ /index.html;"
Write-Host "    }"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DEPLOY COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "  Direct  : http://localhost:3001/api/questions" -ForegroundColor White
Write-Host "  Results : http://localhost:3001/api/results" -ForegroundColor White
Write-Host ""
if ($pm2Available) {
    Write-Host "  PM2 commands:" -ForegroundColor White
    Write-Host "    pm2 status" -ForegroundColor White
    Write-Host "    pm2 logs rag-quiz-backend" -ForegroundColor White
}
Write-Host "============================================" -ForegroundColor Cyan
