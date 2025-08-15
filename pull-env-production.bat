@echo off
echo Pulling production environment variables from Vercel...
echo.

echo Current directory: %CD%
echo.

echo Pulling .env.production from production environment...
vercel env pull .env.production --environment=production

echo.
echo Done! Production environment variables have been pulled to .env.production
echo.

if exist .env.production (
    echo File .env.production created successfully
    cat .env.production
    echo Size: 
    dir .env.production | findstr .env.production

) else (
    echo Warning: .env.production file was not created
)

echo.
pause
