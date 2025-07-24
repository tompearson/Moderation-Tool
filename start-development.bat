@echo off
echo ========================================
echo DEVELOPMENT MODE (Separate Ports)
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo ========================================
set REACT_APP_API_PORT=3001
npm run dev:separate 