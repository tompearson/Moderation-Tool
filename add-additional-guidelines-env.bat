@echo off
echo Adding ADDITIONAL_GUIDELINES_URL to Vercel production environment...
echo.

echo Current environment variables:
vercel env ls

echo.
echo Adding ADDITIONAL_GUIDELINES_URL...
vercel env add ADDITIONAL_GUIDELINES_URL production

echo.
echo Updated environment variables:
vercel env ls

echo.
echo Done! The ADDITIONAL_GUIDELINES_URL has been added to production.
echo You may need to redeploy with: vercel --prod
pause
