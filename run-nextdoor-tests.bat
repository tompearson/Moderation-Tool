@echo off
echo.
echo ========================================
echo   NextDoor Moderation Prompt Tests
echo ========================================
echo.
echo This will test your NextDoor moderation prompt
echo against 10 test cases to validate accuracy.
echo.
echo Make sure your backend server is running first!
echo.
pause
echo.
echo Running tests...
node test-nextdoor-prompt.js
echo.
echo Tests completed! Check the results above.
echo.
pause
