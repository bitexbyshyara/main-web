# BiteX Main Web - Local Dev Server
# Marketing, Registration & Profile portal
# Runs on http://localhost:5173

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BiteX Main Web - Dev Server" -ForegroundColor Cyan
Write-Host "  Marketing | Registration | Profile" -ForegroundColor DarkCyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm install failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example (local defaults)..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "  -> Edit frontend\.env to change API URL or POS URL" -ForegroundColor DarkYellow
    Write-Host ""
}

Write-Host "Starting dev server on http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host ""

npx vite --port 5173
