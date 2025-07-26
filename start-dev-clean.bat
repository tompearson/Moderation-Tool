@echo off
echo ========================================
echo CLEAN DEVELOPMENT START
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo ========================================

REM Kill any existing processes on these ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    if not "%%a"=="0" taskkill /PID %%a /F 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    if not "%%a"=="0" taskkill /PID %%a /F 2>nul
)

REM Wait a moment for processes to fully terminate
timeout /t 2 /nobreak >nul

REM Set environment variable
set REACT_APP_API_PORT=3001

REM Start backend in background
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev:backend"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend server...
npm run dev:frontend 