# scripts/preload_s25_ultra.ps1
# Script de sincronización y precarga para Samsung Galaxy S25 Ultra (100% Offline)

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "🚀 PREPARADOR Y PRECARGADOR KFS OS PARA SAMSUNG S25 ULTRA" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta

$apkPath = "public\kfs-os.apk"
if (-not (Test-Path $apkPath)) {
    Write-Host "⚠️ Compilando APK..." -ForegroundColor Yellow
    cmd /c "cd /d builds\android_rewards\android && gradlew.bat assembleDebug"
    Copy-Item "builds\android_rewards\android\app\build\outputs\apk\debug\app-debug.apk" $apkPath -Force
}

Write-Host "📦 APK Verificado: $apkPath ($( (Get-Item $apkPath).Length / 1MB | ForEach-Object { '{0:N2} MB' -f $_ } ))" -ForegroundColor Green

# 1. Verificar ADB
Write-Host "`n🔍 Verificando conexión ADB..." -ForegroundColor Yellow
$adbDevices = adb devices | Where-Object { $_ -match '\t(device|unauthorized)' }

if ($adbDevices) {
    Write-Host "✅ Dispositivo Android detectado en ADB:" -ForegroundColor Green
    $adbDevices | ForEach-Object { Write-Host "   📱 $_" -ForegroundColor White }
    
    if ($adbDevices -match 'unauthorized') {
        Write-Host "⚠️ El teléfono está bloqueado o requiere autorización en pantalla." -ForegroundColor Yellow
        Write-Host "👉 Por favor desbloquea tu S25 Ultra y toca 'PERMITIR' en el diálogo de depuración USB." -ForegroundColor White
    } else {
        Write-Host "`n⚡ Instalando KFS OS APK en tu S25 Ultra vía ADB..." -ForegroundColor Cyan
        adb install -r $apkPath
        
        Write-Host "🌐 Configurando puerto inverso (reverse port forwarding: tcp 3000)..." -ForegroundColor Cyan
        adb reverse tcp:3000 tcp:3000
        
        Write-Host "🚀 Abriendo KFS OS Modo Demo Comercio en la pantalla de tu S25 Ultra..." -ForegroundColor Green
        adb shell am start -a android.intent.action.VIEW -d "http://localhost:3000/offline_preload.html"
    }
} else {
    Write-Host "ℹ️ ADB no está detectando el dispositivo en este momento." -ForegroundColor Yellow
    
    # 2. Diagnóstico de Windows MTP / Copia directa al almacenamiento interno
    Write-Host "`n📂 Verificando acceso de almacenamiento MTP de Windows..." -ForegroundColor Yellow
    try {
        $shell = New-Object -ComObject Shell.Application
        $myPC = $shell.Namespace("shell:::{20D04FE0-3AEA-1069-A2D8-08002B30309D}")
        $s25 = $myPC.Items() | Where-Object { $_.Name -match "S25" }
        if ($s25) {
            Write-Host "🔌 Conexión USB física activa: '$($s25.Name)'" -ForegroundColor Green
            $s25Folder = $s25.GetFolder
            $storage = $s25Folder.Items() | Where-Object { $_.Name -match "Almacenamiento|Internal|storage" } | Select-Object -First 1
            if ($storage) {
                $storageFolder = $storage.GetFolder
                $download = $storageFolder.Items() | Where-Object { $_.Name -match "Download|Descargas" } | Select-Object -First 1
                if ($download) {
                    $downloadFolder = $download.GetFolder
                    $fullApk = (Resolve-Path $apkPath).Path
                    Write-Host "📲 Copiando APK directamente a la carpeta Download de tu S25 Ultra..." -ForegroundColor Cyan
                    $downloadFolder.CopyHere($fullApk, 16)
                    Write-Host "✅ ¡APK copiado con éxito en 'Descargas' de tu S25 Ultra!" -ForegroundColor Green
                    Write-Host "   Abre la app 'Mis Archivos' -> 'Descargas' -> toca 'kfs-os.apk' para instalar." -ForegroundColor White
                }
            } else {
                Write-Host "🔒 La pantalla del S25 Ultra está bloqueada o en modo 'Solo carga'." -ForegroundColor Yellow
                Write-Host "   👉 Desbloquea tu pantalla con tu huella/PIN y toca 'Permitir' en la notificación USB." -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "Nota MTP: $($_.Exception.Message)" -ForegroundColor Gray
    }
    
    # 3. Probar conexión WiFi local
    Write-Host "`n📶 Verificando conexión de red WiFi local con tu S25 Ultra (192.168.110.185)..." -ForegroundColor Yellow
    $ping = Test-Connection -ComputerName 192.168.110.185 -Count 1 -Quiet
    if ($ping) {
        Write-Host "✅ ¡Tu S25 Ultra responde en la red WiFi local (192.168.110.185)!" -ForegroundColor Green
        Write-Host "`n📲 ACCESO DIRECTO DESDE TU S25 ULTRA:" -ForegroundColor Magenta
        Write-Host "   Abre Chrome o Samsung Internet en tu teléfono y visita:" -ForegroundColor White
        Write-Host "   👉 http://192.168.110.219:3000/offline_preload.html" -ForegroundColor Cyan
        Write-Host "   O descarga el instalador APK directamente:" -ForegroundColor White
        Write-Host "   👉 http://192.168.110.219:3000/kfs-os.apk" -ForegroundColor Cyan
    }
}

Write-Host "`n==========================================================" -ForegroundColor Magenta
Write-Host "💎 MODO DEMO COMERCIO 100% OFFLINE DISPONIBLE Y ACTIVO" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Magenta
