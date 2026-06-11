# RAG Quiz - Dev Mode (Windows)
# Usage: powershell -ExecutionPolicy Bypass -File dev.ps1
# Starts backend(:3001) + frontend Vite dev server(:5173)

$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RAG Quiz - DEV MODE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Install deps (first run)
if (-not (Test-Path "$ProjectDir\backend\node_modules")) {
    Write-Host "[init] Installing backend deps..." -ForegroundColor Yellow
    Set-Location "$ProjectDir\backend"; npm install
}
if (-not (Test-Path "$ProjectDir\frontend\node_modules")) {
    Write-Host "[init] Installing frontend deps..." -ForegroundColor Yellow
    Set-Location "$ProjectDir\frontend"; npm install
}

# Start backend as background job
Write-Host "[backend] Starting backend -> http://localhost:3001" -ForegroundColor Green
$backendJob = Start-Job -Name "rag-quiz-backend" -ArgumentList $ProjectDir -ScriptBlock {
    param($dir)
    Set-Location $dir
    node "$dir\backend\server.js"
}

Start-Sleep -Seconds 1

# Start frontend (foreground, Ctrl+C to stop)
Write-Host "[frontend] Starting Vite dev server -> http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor White
Write-Host "  Backend  : http://localhost:3001" -ForegroundColor White
Write-Host "  API      : http://localhost:3001/api/questions" -ForegroundColor White
Write-Host "  Press Ctrl+C to stop all" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$ProjectDir\frontend"
npx vite --host

# Cleanup backend job after Vite exits
Write-Host ""
Write-Host "Stopping backend job..." -ForegroundColor Yellow
Stop-Job -Name "rag-quiz-backend" -ErrorAction SilentlyContinue
Remove-Job -Name "rag-quiz-backend" -ErrorAction SilentlyContinue
Write-Host "All stopped." -ForegroundColor Green
