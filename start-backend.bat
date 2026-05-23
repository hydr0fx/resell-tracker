@echo off
cd /d "C:\FlippyBird\backend"
set PATH=C:\Program Files\nodejs;%PATH%

echo Starte Flippy Bird Backend...
start /MIN "FlippyBird Backend" node server.js
timeout /t 3 /nobreak >nul

echo Starte oeffentlichen Tunnel (Cloudflare Tunnel)...
set "CF_PATH=C:\Users\HydroFX\AppData\Local\Microsoft\WinGet\Packages\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\cloudflared.exe"
start /MIN "FlippyBird Tunnel" "%CF_PATH%" tunnel --url http://localhost:3001 --http-host-header localhost:3001
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  Backend laeuft auf Port 3001
echo  Tunnel wird aufgebaut...
echo  Pruefe Cloudflare Tunnel Logs fuer die URL
echo  URL: https://XXXXX.trycloudflare.com
echo ========================================
echo.
echo  Druecke eine Taste zum Beenden
pause >nul

taskkill /f /fi "WINDOWTITLE eq FlippyBird Backend" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq FlippyBird Tunnel" >nul 2>&1
taskkill /f /im cloudflared.exe >nul 2>&1
echo Beendet.
