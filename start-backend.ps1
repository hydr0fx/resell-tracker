$BackendDir = "C:\FlippyBird\backend"
$NodePath = "C:\Program Files\nodejs"

# Add node to PATH
$env:PATH = "$NodePath;$env:PATH"

# Kill old tunnel
Get-Process -Name "ssh" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "localhost.run" } | Stop-Process -Force

# Start backend if not running
$portCheck = netstat -an | Select-String ":3001 "
if (-not $portCheck) {
    Write-Host "Starte Backend..." -ForegroundColor Green
    $job = Start-Job -ScriptBlock { param($dir,$p) cd $dir; $env:PATH="$p;$env:PATH"; node server.js } -ArgumentList $BackendDir,$NodePath
    Start-Sleep -Seconds 3
} else {
    Write-Host "Backend läuft bereits auf Port 3001" -ForegroundColor Green
}

# Start SSH tunnel
Write-Host "Starte öffentlichen Tunnel (localhost.run)..." -ForegroundColor Yellow
$tunnelJob = Start-Job -ScriptBlock {
    $env:PATH = "$using:NodePath;$env:PATH"
    $result = ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:3001 nokey@localhost.run 2>&1
    $result
}
Start-Sleep -Seconds 5

# Get tunnel URL from job output
$tunnelOutput = Receive-Job -Job $tunnelJob -Keep
$url = $tunnelOutput | Select-String -Pattern "https://[\w-]+\.localhost\.run" | ForEach-Object { $_.Matches.Value } | Select-Object -First 1

if ($url) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✅ Backend öffentlich erreichbar unter:" -ForegroundColor Green
    Write-Host "$url" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔗 Konfiguriere diese URL in der PWA:" -ForegroundColor Yellow
    Write-Host "   In der App unter Einstellungen > API-URL" -ForegroundColor Yellow
    Write-Host "   Oder: localStorage.setItem('ka_api_url','$url/api')" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Drücke STRG+C zum Beenden" -ForegroundColor Red

    # Keep tunnel alive
    Wait-Job -Job $tunnelJob
} else {
    Write-Host ""
    Write-Host "❌ Konnte keine Tunnel-URL ermitteln." -ForegroundColor Red
    Write-Host "Tunnel-Output:" -ForegroundColor Yellow
    $tunnelOutput | Write-Host
    Write-Host ""
    Write-Host "Versuche alternativen Tunnel (serveo.net)..." -ForegroundColor Yellow

    $tunnelJob2 = Start-Job -ScriptBlock {
        ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:3001 serveo.net 2>&1
    }
    Start-Sleep -Seconds 5
    $tunnelOutput2 = Receive-Job -Job $tunnelJob2 -Keep
    $url2 = $tunnelOutput2 | Select-String -Pattern "https://[\w-]+\.serveo\.net|Forwarding.*https" | ForEach-Object { $_.Matches.Value } | Select-Object -First 1
    if ($url2) {
        Write-Host "✅ Tunnel: $url2" -ForegroundColor Green
        Wait-Job -Job $tunnelJob2
    } else {
        Write-Host "❌ Auch serveo.net fehlgeschlagen." -ForegroundColor Red
        Write-Host "Tunnel-Output: $tunnelOutput2" -ForegroundColor Yellow
    }
}
