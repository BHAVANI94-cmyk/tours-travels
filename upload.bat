@echo off
title Uploading Tours & Travels Project to GitHub
cd /d "%~dp0"

echo =======================================================
echo Preparing to upload tours-travels-app to GitHub...
echo =======================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    goto end
)

echo [1/5] Checking Git identity...
git config user.name >nul 2>&1
if %errorlevel% neq 0 goto set_identity
git config user.email >nul 2>&1
if %errorlevel% neq 0 goto set_identity
echo Git identity already configured.
goto identity_ok

:set_identity
echo.
echo =======================================================
echo Git identity (name/email) is not configured on this computer.
echo Please enter your details to set up your commit author.
echo =======================================================
set /p gitname="Enter your Name (e.g. Gowri): "
set /p gitemail="Enter your Email (e.g. your-email@example.com): "
git config --global user.name "%gitname%"
git config --global user.email "%gitemail%"
echo Identity configured successfully!
echo.

:identity_ok
echo.
echo [2/5] Initializing Git repository...
if not exist .git (
    git init
) else (
    echo Git already initialized.
)
echo.

echo [3/5] Configuring remote origin...
git remote add origin https://github.com/BHAVANI94-cmyk/tours-travels.git >nul 2>nul
:: If remote already exists, update it to match the requested URL
git remote set-url origin https://github.com/BHAVANI94-cmyk/tours-travels.git
echo Remote origin set to: https://github.com/BHAVANI94-cmyk/tours-travels.git
echo.

echo [4/5] Staging and committing files...
echo (This may take a moment. Sensitive files and node_modules are ignored via .gitignore)
git add .
git commit -m "Initial commit of tours & travels application"
echo.

echo [5/5] Pushing to GitHub...
echo.
echo Please log in to GitHub in the browser window if prompted.
git branch -M main
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Make sure you are authenticated and have write access to:
    echo https://github.com/BHAVANI94-cmyk/tours-travels
) else (
    echo.
    echo =======================================================
    echo Success! Your project has been uploaded to GitHub!
    echo URL: https://github.com/BHAVANI94-cmyk/tours-travels
    echo =======================================================
)

:end
echo.
echo Press any key to close this window...
pause >nul
