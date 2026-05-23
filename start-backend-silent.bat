@echo off
cd /d "C:\FlippyBird\backend"
set PATH=C:\Program Files\nodejs;%PATH%
set "LOG=C:\FlippyBird\tunnel_url.txt"

echo %DATE% %TIME% Starting backend... >> "%LOG%"
start /MIN "FlippyBird Backend" node server.js
timeout /t 3 /nobreak >nul

echo %DATE% %TIME% Starting tunnel... >> "%LOG%"
set "CF_PATH=C:\Users\HydroFX\AppData\Local\Microsoft\WinGet\Packages\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\cloudflared.exe"
start /MIN "FlippyBird Tunnel" "%CF_PATH%" tunnel --url http://localhost:3001 --http-host-header localhost:3001 --logfile "%LOG%.cloudflared"
echo %DATE% %TIME% Tunnel gestartet! >> "%LOG%"
