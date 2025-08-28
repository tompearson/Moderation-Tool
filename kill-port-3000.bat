@echo off
setlocal enabledelayedexpansion
echo Finding processes using ports 3000 and 3001...

REM Find processes using port 3000 (excluding system processes)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo Found process ID: %%a on port 3000
        echo Killing process ID: %%a
        taskkill /PID %%a /F 2>nul
        if !errorlevel! equ 0 (
            echo Successfully killed process %%a
        ) else (
            echo Failed to kill process %%a (may be system process)
        )
    )
)

REM Find processes using port 3001 (excluding system processes)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    if not "%%a"=="0" (
        echo Found process ID: %%a on port 3001
        echo Killing process ID: %%a
        taskkill /PID %%a /F 2>nul
        if !errorlevel! equ 0 (
            echo Successfully killed process %%a
        ) else (
            echo Failed to kill process %%a (may be system process)
        )
    )
)

REM Find processes using port 3002 (excluding system processes)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do (
    if not "%%a"=="0" (
        echo Found process ID: %%a on port 3002
        echo Killing process ID: %%a
        taskkill /PID %%a /F 2>nul
        if !errorlevel! equ 0 (
            echo Successfully killed process %%a
        ) else (
            echo Failed to kill process %%a (may be system process)
        )
    )
)


echo Done killing processes on ports 3000 and 3001.
