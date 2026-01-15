@echo off
REM Script to help push the MERN Docker project to GitHub (Windows)

echo 🚀 MERN Docker - GitHub Push Helper
echo ====================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing git repository...
    git init
    echo ✅ Git repository initialized
    echo.
)

REM Check if there are uncommitted changes
git diff --quiet
if errorlevel 1 (
    echo 📝 Staging all changes...
    git add .
    echo ✅ Changes staged
    echo.
    
    echo 💾 Committing changes...
    git commit -m "Add MERN stack with MySQL, Docker, and CI/CD"
    echo ✅ Changes committed
    echo.
) else (
    git diff --cached --quiet
    if errorlevel 1 (
        echo 💾 Committing staged changes...
        git commit -m "Add MERN stack with MySQL, Docker, and CI/CD"
        echo ✅ Changes committed
        echo.
    ) else (
        echo ℹ️  No changes to commit
        echo.
    )
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ No remote repository configured
    echo.
    set /p REMOTE_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "
    git remote add origin "%REMOTE_URL%"
    echo ✅ Remote added
    echo.
) else (
    for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
    echo 🔗 Remote repository: %REMOTE_URL%
    echo.
)

REM Set main branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" if not "%CURRENT_BRANCH%"=="master" (
    echo 🌿 Setting branch to 'main'...
    git branch -M main
    echo ✅ Branch set to main
    echo.
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
echo.
set /p CONFIRM="Ready to push? (y/n): "
if /i "%CONFIRM%"=="y" (
    git push -u origin main
    if errorlevel 1 (
        echo.
        echo ❌ Push failed. Please check your credentials and try again.
        echo    You may need to set up authentication:
        echo    - Personal Access Token: https://github.com/settings/tokens
        echo    - Or use SSH: git remote set-url origin git@github.com:username/repo.git
    ) else (
        echo.
        echo ✅ Successfully pushed to GitHub!
        echo.
        echo 🎉 Your CI/CD pipeline will now run automatically!
        echo    Check the 'Actions' tab in your GitHub repository to see the workflow.
    )
) else (
    echo ⏭️  Push cancelled
)

pause
