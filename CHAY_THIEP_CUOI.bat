@echo off
setlocal
title Thiep cuoi online

rem Always run from this file's folder, including paths with spaces.
cd /d "%~dp0"
if errorlevel 1 goto folder_error

where node.exe >nul 2>&1
if errorlevel 1 goto node_error
where npm.cmd >nul 2>&1
if errorlevel 1 goto node_error

if not exist "node_modules\.bin\vite.cmd" (
    echo Dang cai cac thu vien can thiet. Lan dau co the mat vai phut...
    if exist "package-lock.json" (
        call npm.cmd ci
    ) else (
        call npm.cmd install
    )
    if errorlevel 1 goto install_error
)

echo Dang mo thiep cuoi...
echo Trinh duyet se tu dong mo khi trang san sang.
echo Giu cua so nay mo trong khi xem thiep.
echo De dung: nhan Ctrl+C hoac dong cua so nay.
echo.
call npm.cmd run dev -- --host 127.0.0.1 --port 3000 --open %*
if errorlevel 1 goto run_error
exit /b 0

:node_error
echo Chua tim thay Node.js hoac npm.
echo Hay cai Node.js tu https://nodejs.org/ roi chay lai file nay.
goto failed

:folder_error
echo Khong mo duoc thu muc du an. Hay dat file BAT trong thu muc thiep cuoi.
goto failed

:install_error
echo Cai thu vien chua thanh cong. Kiem tra ket noi Internet roi chay lai.
goto failed

:run_error
echo Chua chay duoc thiep. Xem thong bao loi o phia tren.

:failed
echo.
pause
exit /b 1
