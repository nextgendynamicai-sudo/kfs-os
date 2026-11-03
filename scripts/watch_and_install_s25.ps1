# scripts/watch_and_install_s25.ps1
# Monitor and auto-deploy to Samsung Galaxy S25 Ultra as soon as authorized

$apkPath = "public\kfs-os.apk"
$targetSerial = "R5GYB30DZVW"

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "🚀 MONITOR DE INSTALACIÓN AUTOMÁTICA EN SAMSUNG S25 ULTRA" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "Dispositivo objetivo: $targetSerial (Samsung Galaxy S25 Ultra)" -ForegroundColor Yellow
Write-Host "Esperando autorización en la pantalla del teléfono..." -ForegroundColor White

$maxAttempts = 60 # 2 minutos
$attempt = 0
$installed = $false

while ($attempt -lt $maxAttempts -and -not $installed) {
    $devices = adb devices -l | Out-String
    
    if ($devices -match "$targetSerial\s+device") {
        Write-Host "`n🎉 ¡DISPOSITIVO AUTORIZADO Y LISTO!" -ForegroundColor Green
        
        Write-Host "1️⃣ Copiando instalador APK a la carpeta Descargas del teléfono..." -ForegroundColor Cyan
        adb -s $targetSerial push $apkPath /sdcard/Download/kfs-os.apk
        
        Write-Host "2️⃣ Instalando aplicación nativa KFS OS APK..." -ForegroundColor Cyan
        $installRes = adb -s $targetSerial install -r $apkPath
        Write-Host "Resultado instalación: $installRes" -ForegroundColor Green
        
        Write-Host "3️⃣ Configurando túnel de red directo (Reverse Port TCP 3000)..." -ForegroundColor Cyan
        adb -s $targetSerial reverse tcp:3000 tcp:3000
        
        Write-Host "4️⃣ Precargando datos completos 100% Offline en Chrome..." -ForegroundColor Cyan
        adb -s $targetSerial shell am start -a android.intent.action.VIEW -d "http://localhost:3000/offline_preload.html"
        
        Write-Host "`n✅ ¡INSTALACIÓN Y PRECARGA 100% COMPLETADA EN TU S25 ULTRA!" -ForegroundColor Green
        $installed = $true
        break
    } elseif ($devices -match "$targetSerial\s+unauthorized") {
        Write-Host -NoNewline "."
    } else {
        Write-Host -NoNewline "?"
    }
    
    Start-Sleep -Seconds 2
    $attempt++
}

if (-not $installed) {
    Write-Host "`n⚠️ Tiempo de espera agotado. Por favor asegúrate de desbloquear el teléfono y tocar 'Permitir'." -ForegroundColor Yellow
}
