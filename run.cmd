@echo off
title Story Platform Launcher
echo ===================================================
echo Starting Story Platform Backend and Frontend...
echo ===================================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /c "cd backend && npm run dev"

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /c "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Backend will be available at http://localhost:5000
echo - Frontend will be available at http://localhost:3000
echo.
pause
