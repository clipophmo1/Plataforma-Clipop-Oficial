@echo off
:: Solicitar permisos de administrador automáticamente
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de administrador...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

echo =======================================================
echo    RESTAURANDO CONFIGURACION AUTOMATICA (DHCP)
echo =======================================================
echo.
echo Restaurando IP automatica en Ethernet...
netsh interface ipv4 set address name="Ethernet" source=dhcp
netsh interface ipv4 set dnsservers name="Ethernet" source=dhcp

echo.
echo =======================================================
echo Listo. Tu conexion Ethernet ha vuelto a la normalidad.
echo =======================================================
pause
