@echo off
title Starting Tours & Travels Application
cd /d "%~dp0"

echo =======================================================
echo Starting Tours & Travels Application (Backend + Frontend)...
echo =======================================================
echo.

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your system PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    goto end
)

:: Run development environment
npm run dev

:end
echo.
echo Press any key to close this window...
pause >nul
