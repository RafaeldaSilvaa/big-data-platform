@echo off
REM ==============================================================================
REM Big Data Platform - Startup Script for Windows
REM ==============================================================================
REM This script initializes and starts all Big Data platform services.
REM Usage: start-platform.bat [OPTIONS]
REM
REM Options:
REM   --build     Build all Docker images before starting
REM   --no-build  Start services without building images
REM   --logs      Show logs after starting
REM   --help      Show this help message
REM   --stop      Stop all services
REM ==============================================================================

@echo off
setlocal enabledelayedexpansion

set "PLATFORM_DIR=%~dp0"
set "PLATFORM_DIR=%PLATFORM_DIR:~0,-1%"

REM Colors for output (Windows CMD doesn't support native colors, using simple markers)
set "BLUE=[INFO]"
set "GREEN=[SUCCESS]"
set "YELLOW=[WARNING]"
set "RED=[ERROR]"

REM Default values
set "BUILD_IMAGES=false"
set "SHOW_LOGS=false"
set "STOP_SERVICES=false"

REM ==============================================================================
REM Functions
REM ==============================================================================

:log_info
    echo %BLUE% %~1%
    goto :eof

:log_success
    echo %GREEN% %~1%
    goto :eof

:log_warning
    echo %YELLOW% %~1%
    goto :eof

:log_error
    echo %RED% %~1%
    goto :eof

:show_help
    echo Big Data Platform - Startup Script
    echo.
    echo Usage: %~nx0 [OPTIONS]
    echo.
    echo Options:
    echo   --build       Build all Docker images before starting
    echo   --no-build    Start services without building images (default)
    echo   --logs        Show logs after starting
    echo   --stop        Stop all services
    echo   --help        Show this help message
    echo.
    echo Examples:
    echo   %~nx0                    - Start services
    echo   %~nx0 --build            - Build images and start
    echo   %~nx0 --build --logs     - Build, start and show logs
    echo   %~nx0 --stop            - Stop all services
    goto :eof

:check_requirements
    call :log_info Checking requirements...

    REM Check Docker
    docker --version >nul 2>&1
    if errorlevel 1 (
        call :log_error Docker is not installed. Please install Docker first.
        exit /b 1
    )

    REM Check Docker Compose
    docker compose version >nul 2>&1
    if errorlevel 1 (
        docker-compose --version >nul 2>&1
        if errorlevel 1 (
            call :log_error Docker Compose is not installed. Please install Docker Compose first.
            exit /b 1
        )
        set "COMPOSE_CMD=docker-compose"
    ) else (
        set "COMPOSE_CMD=docker compose"
    )

    call :log_success All requirements met!
    echo.
    goto :eof

:build_images
    call :log_info Building Docker images...
    echo.

    cd /d "%PLATFORM_DIR%"

    if exist "build-images.bat" (
        call build-images.bat
    ) else (
        if exist "build-images.sh" (
            call :log_warning Using docker compose build
            !COMPOSE_CMD! build
        ) else (
            call :log_error build-images script not found
            exit /b 1
        )
    )

    call :log_success Docker images built successfully!
    echo.
    goto :eof

:start_services
    call :log_info Starting Big Data Platform services...
    echo.

    cd /d "%PLATFORM_DIR%"
    !COMPOSE_CMD! up -d

    call :log_success All services started!
    echo.
    goto :eof

:wait_for_services
    call :log_info Waiting for services to be ready...
    echo.

    REM Wait for services to initialize
    timeout /t 10 /nobreak >nul

    cd /d "%PLATFORM_DIR%"
    !COMPOSE_CMD! ps

    echo.
    call :log_success Services are starting!
    echo.
    goto :eof

:show_status
    call :log_info Platform services status:
    echo.

    cd /d "%PLATFORM_DIR%"
    !COMPOSE_CMD! ps

    echo.
    echo ==============================================
    echo   Big Data Platform is running!
    echo ==============================================
    echo.
    echo Access the following interfaces:
    echo.
    echo   Frontend Dashboard:  http://localhost:3000
    echo   HDFS NameNode:       http://localhost:9870
    echo   YARN ResourceManager: http://localhost:8088
    echo   Spark Master:        http://localhost:8080
    echo   Spark Worker:        http://localhost:8081
    echo   HBase Master:        http://localhost:16010
    echo   NiFi:                https://localhost:8443
    echo   Oozie:               http://localhost:11000
    echo.
    echo To view logs: docker compose logs -f
    echo To stop:      docker compose down
    echo.
    goto :eof

:show_logs
    call :log_info Showing logs (Ctrl+C to exit)...
    echo.

    cd /d "%PLATFORM_DIR%"
    !COMPOSE_CMD! logs -f
    goto :eof

:stop_services
    call :log_info Stopping Big Data Platform services...
    echo.

    cd /d "%PLATFORM_DIR%"
    !COMPOSE_CMD! down

    call :log_success All services stopped!
    echo.
    goto :eof

REM ==============================================================================
REM Main Script
REM ==============================================================================

REM Parse arguments
:parse_args
if "%~1"=="" goto main
if /i "%~1"=="--build" (
    set "BUILD_IMAGES=true"
    shift
    goto parse_args
)
if /i "%~1"=="--no-build" (
    set "BUILD_IMAGES=false"
    shift
    goto parse_args
)
if /i "%~1"=="--logs" (
    set "SHOW_LOGS=true"
    shift
    goto parse_args
)
if /i "%~1"=="--stop" (
    set "STOP_SERVICES=true"
    shift
    goto parse_args
)
if /i "%~1"=="--help" (
    call :show_help
    exit /b 0
)
if /i "%~1"=="-h" (
    call :show_help
    exit /b 0
)
call :log_error Unknown option: %~1
call :show_help
exit /b 1

:main
echo.
echo ==============================================
echo   Big Data Platform - Starting
echo ==============================================
echo.

call :check_requirements

if "%STOP_SERVICES%"=="true" (
    call :stop_services
    goto end
)

if "%BUILD_IMAGES%"=="true" (
    call :build_images
)

call :start_services
call :wait_for_services
call :show_status

if "%SHOW_LOGS%"=="true" (
    call :show_logs
)

:end
endlocal