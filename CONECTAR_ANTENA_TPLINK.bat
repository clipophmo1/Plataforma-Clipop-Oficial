@echo off
:: Solicitar permisos de administrador automáticamente
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de administrador...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo ================================================================
echo    CONFIGURANDO ACCESO A LA ANTENA TP-LINK (192.168.0.254)
echo ================================================================
echo.
echo Limpiando configuracion anterior y asignando IP 192.168.0.100...
powershell -Command "Get-NetIPAddress -InterfaceAlias 'Ethernet' -AddressFamily IPv4 -ErrorAction SilentlyContinue | Remove-NetIPAddress -Confirm:$false -ErrorAction SilentlyContinue; New-NetIPAddress -InterfaceAlias 'Ethernet' -IPAddress '192.168.0.100' -PrefixLength 24 -DefaultGateway '192.168.0.254' -SkipAsSource $false"

echo.
echo Probando comunicacion con la antena (192.168.0.254)...
ping 192.168.0.254 -n 4

echo.
echo Abriendo la antena en tu navegador...
start http://192.168.0.254
start https://192.168.0.254

echo.
echo ================================================================
echo Listo! Revisa si te respondio el ping arriba y si abrio el navegador.
echo Usuario: admin / Clave: admin
echo ================================================================
pause
