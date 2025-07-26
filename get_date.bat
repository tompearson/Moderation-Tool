@echo off
:: Get current date components using WMIC
for /f "tokens=2 delims==" %%A in ('wmic os get localdatetime /value') do set dt=%%A

:: Extract each component
set yyyy=%dt:~0,4%
set mm=%dt:~4,2%
set dd=%dt:~6,2%

:: Combine into desired format
set formatted_date=%mm%-%dd%-%yyyy%

:: Output the result (or use it however you'd like)
echo %formatted_date%
