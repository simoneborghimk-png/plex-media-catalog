@echo off
chcp 65001 >nul
title Aggiornamento Catalogo Plex
echo ========================================================
echo   Aggiornamento Catalogo Plex (Plex Media Catalog)
echo ========================================================
echo.

cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" scripts\export_plex.py
        goto fine
    )
    if exist "%LOCALAPPDATA%\Programs\Python\Launcher\py.exe" (
        "%LOCALAPPDATA%\Programs\Python\Launcher\py.exe" scripts\export_plex.py
        goto fine
    )
    echo [X] Errore: Python 3 non trovato nel PATH.
    pause
    exit /b 1
)

python scripts\export_plex.py

:fine
echo.
pause
