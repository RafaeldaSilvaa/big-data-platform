@echo off
REM ==============================================================================
REM Big Data Platform - Build Images Script for Windows
REM ==============================================================================
REM This script builds all Docker images for the Big Data Platform.
REM Usage: build-images.bat
REM ==============================================================================

@echo off
setlocal enabledelayedexpansion

set "PLATFORM_DIR=%~dp0"
set "PLATFORM_DIR=%PLATFORM_DIR:~0,-1%"
set "IMAGES_DIR=%PLATFORM_DIR%\images"

echo.
echo ==============================================
echo   Building Big Data Platform Images
echo ==============================================
echo.

REM Check if Docker is available
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check Docker Compose version
docker compose version >nul 2>&1
if errorlevel 1 (
    set "COMPOSE_CMD=docker-compose"
) else (
    set "COMPOSE_CMD=docker compose"
)

echo [INFO] Building Docker images...
echo.

cd /d "%PLATFORM_DIR%"

REM List of images to build in order (base first, then dependents)
set "IMAGES=base"

REM Check which images exist and add them
if exist "%IMAGES_DIR%\hadoop" set "IMAGES=!IMAGES! hadoop"
if exist "%IMAGES_DIR%\zookeeper" set "IMAGES=!IMAGES! zookeeper"
if exist "%IMAGES_DIR%\kafka" set "IMAGES=!IMAGES! kafka"
if exist "%IMAGES_DIR%\spark" set "IMAGES=!IMAGES! spark"
if exist "%IMAGES_DIR%\hive" set "IMAGES=!IMAGES! hive"
if exist "%IMAGES_DIR%\hbase" set "IMAGES=!IMAGES! hbase"
if exist "%IMAGES_DIR%\nifi" set "IMAGES=!IMAGES! nifi"
if exist "%IMAGES_DIR%\flume" set "IMAGES=!IMAGES! flume"
if exist "%IMAGES_DIR%\sqoop" set "IMAGES=!IMAGES! sqoop"
if exist "%IMAGES_DIR%\oozie" set "IMAGES=!IMAGES! oozie"
if exist "%IMAGES_DIR%\mahout" set "IMAGES=!IMAGES! mahout"
if exist "%IMAGES_DIR%\pig" set "IMAGES=!IMAGES! pig"

echo [INFO] Images to build: !IMAGES!
echo.

REM Build each image
for %%I in (!IMAGES!) do (
    echo [INFO] Building %%I image...
    if exist "%IMAGES_DIR%\%%I" (
        docker build -t bigdata-platform-%%I:latest "%IMAGES_DIR%\%%I"
        if errorlevel 1 (
            echo [ERROR] Failed to build %%I image
            exit /b 1
        )
        echo [SUCCESS] %%I image built successfully
    ) else (
        echo [WARNING] %%I directory not found, skipping
    )
    echo.
)

echo ==============================================
echo   All images built successfully!
echo ==============================================
echo.
echo Image list:
docker images | findstr "bigdata-platform"

endlocal