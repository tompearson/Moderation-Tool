@echo off
echo.
echo 🚀 Starting Production Deployment...
echo ======================================
echo.

echo 📦 Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Exiting...
    pause
    exit /b 1
)
echo ✅ Build completed successfully!
echo.

echo 🌐 Deploying to Vercel production...
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Deployment failed! Exiting...
    pause
    exit /b 1
)
echo.

echo 🎉 Deployment completed successfully!
echo.
echo 📍 Your app is now live at: https://moderation-assistant-tool.vercel.app/
echo.
echo 💡 Remember to:
echo    - Test the new pages
echo    - Check that clean URLs work
echo    - Verify version information displays correctly
echo.


