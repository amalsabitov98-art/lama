@echo off
setlocal
cd /d "%~dp0"
title Watermark Cleaner - установка

set "PYTHON_LAUNCHER=py -3"
where py >nul 2>nul
if errorlevel 1 (
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python ne naiden. Ustanovite Python 3.11 ili novee s python.org.
    echo Pri ustanovke vklyuchite punkt Add Python to PATH.
    pause
    exit /b 1
  )
  set "PYTHON_LAUNCHER=python"
)

if not exist ".venv\Scripts\python.exe" (
  echo Sozdayu lokalnoe okruzhenie...
  %PYTHON_LAUNCHER% -m venv .venv
  if errorlevel 1 goto :error
)

echo Ustanavlivayu neobhodimye komponenty...
".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 goto :error
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :error

call start.bat
exit /b 0

:error
echo.
echo Ustanovka ne udalas. Proverte internet i povtorite zapusk.
pause
exit /b 1
