@echo off
setlocal
cd /d "%~dp0"
title Watermark Cleaner

if not exist ".venv\Scripts\pythonw.exe" (
  echo Snachala zapustite install_and_start.bat
  pause
  exit /b 1
)

start "" ".venv\Scripts\pythonw.exe" app.py
