@echo off
set "PROJECT_DIR=%~dp0"
set "FRONTEND_URL=http://127.0.0.1:5173"

echo Starting CareCircle...

netstat -ano | findstr /R /C:":5000 .*LISTENING" >nul
if errorlevel 1 (
  start "CareCircle Backend" /D "%PROJECT_DIR%backend" cmd /k npm start
) else (
  echo Backend is already running on port 5000.
)

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if errorlevel 1 (
  start "CareCircle Frontend" /D "%PROJECT_DIR%frontend" cmd /k npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
) else (
  echo Frontend is already running on port 5173.
)

echo Opening website...
timeout /t 7 /nobreak >nul
start "" "%FRONTEND_URL%"

exit
