#!/bin/bash
# ==============================================================================
# Big Data Platform - Startup Script
# ==============================================================================
# This script initializes and starts all Big Data platform services.
# Usage: ./start-platform.sh [OPTIONS]
#
# Options:
#   --build     Build all Docker images before starting
#   --no-build  Start services without building images
#   --logs      Show logs after starting
#   --help      Show this help message
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PLATFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PLATFORM_DIR/docker-compose.yml"

# Default values
BUILD_IMAGES=false
SHOW_LOGS=false

# ==============================================================================
# Functions
# ==============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    echo "Big Data Platform - Startup Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --build       Build all Docker images before starting"
    echo "  --no-build    Start services without building images (default)"
    echo "  --logs        Show logs after starting"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Start services"
    echo "  $0 --build            # Build images and start"
    echo "  --build --logs        # Build, start and show logs"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check docker compose plugin (preferido) ou fallback
    DOCKER_COMPOSE_CMD="docker compose"
    if ! docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
    
    log_success "All requirements met!"
    echo ""
}

build_images() {
    log_info "Building Docker images..."
    echo ""
    
    cd "$PLATFORM_DIR"
    
    if [ -f "build-images.sh" ]; then
        chmod +x build-images.sh
        bash build-images.sh
    else
        log_warning "build-images.sh not found, using docker compose build"
        $DOCKER_COMPOSE_CMD build
    fi
    
    log_success "Docker images built successfully!"
    echo ""
}

start_services() {
    log_info "Starting Big Data Platform services..."
    echo ""
    
    cd "$PLATFORM_DIR"
    
    # Start all services
    $DOCKER_COMPOSE_CMD up -d
    
    log_success "All services started!"
    echo ""
}

wait_for_services() {
    log_info "Waiting for services to be ready..."
    echo ""
    
    # Wait a bit for services to initialize
    sleep 10
    
    # Check services status
    cd "$PLATFORM_DIR"
    $DOCKER_COMPOSE_CMD ps
    
    echo ""
    log_success "Services are starting!"
    echo ""
}

show_status() {
    log_info "Platform services status:"
    echo ""
    
    cd "$PLATFORM_DIR"
    $DOCKER_COMPOSE_CMD ps
    
    echo ""
    echo "=============================================="
    echo "  Big Data Platform is running!"
    echo "=============================================="
    echo ""
    echo "Access the following interfaces:"
    echo ""
    echo "  🌐 Frontend Dashboard:  http://localhost:3000"
    echo "  🌐 HDFS NameNode:       http://localhost:9870"
    echo "  🌐 YARN ResourceManager: http://localhost:8088"
    echo "  🌐 Spark Master:        http://localhost:8080"
    echo "  🌐 Spark Worker:        http://localhost:8081"
    echo "  🌐 HBase Master:        http://localhost:16010"
    echo "  🌐 NiFi:                https://localhost:8443"
    echo "  🌐 Oozie:               http://localhost:11000"
    echo ""
    echo "To view logs: docker compose logs -f"
    echo "To stop:      docker compose down"
    echo ""
}

show_logs() {
    log_info "Showing logs (Ctrl+C to exit)..."
    echo ""
    
    cd "$PLATFORM_DIR"
    $DOCKER_COMPOSE_CMD logs -f
}

stop_services() {
    log_info "Stopping Big Data Platform services..."
    echo ""
    
    cd "$PLATFORM_DIR"
    $DOCKER_COMPOSE_CMD down
    
    log_success "All services stopped!"
    echo ""
}

# ==============================================================================
# Main Script
# ==============================================================================

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD_IMAGES=true
            shift
            ;;
        --no-build)
            BUILD_IMAGES=false
            shift
            ;;
        --logs)
            SHOW_LOGS=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
echo ""
echo "=============================================="
echo "  Big Data Platform - Starting"
echo "=============================================="
echo ""

check_requirements

if [ "$BUILD_IMAGES" = true ]; then
    build_images
fi

start_services
wait_for_services
show_status

if [ "$SHOW_LOGS" = true ]; then
    show_logs
fi