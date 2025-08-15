@echo off
echo Creating .env file with GUIDELINES_URL...

echo # Community Moderation Tool Environment Variables > .env
echo. >> .env
echo # Google Gemini API Key >> .env
echo # Get your API key from: https://makersuite.google.com/app/apikey >> .env
echo GEMINI_API_KEY=your_gemini_api_key_here >> .env
echo. >> .env
echo # Server Configuration (optional) >> .env
echo PORT=3000 >> .env
echo. >> .env
echo # Environment (optional) >> .env
echo NODE_ENV=development >> .env
echo. >> .env
echo # Guidelines URL (optional) >> .env
echo # Set to 'embedded' to use built-in rules only >> .env
echo # Set to a URL to fetch rules from external source >> .env
echo GUIDELINES_URL=https://gist.githubusercontent.com/tompearson/87c37f055ee8220b421ce78c668c093b/raw/bcd17f434de2fb33b7288ff51eba68e52ae14a3e/NextDoor-Guidelines-content.md >> .env

echo .env file created successfully!
echo.
echo Please edit the .env file and replace 'your_gemini_api_key_here' with your actual API key.
echo Then restart your server.
pause 