#!/bin/bash

# Big Data Platform - Build All Images Script
# Builds Docker images in the correct order (with inheritance)

set -e

echo "=============================================="
echo "  Big Data Platform - Building Docker Images"
echo "=============================================="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="${SCRIPT_DIR}/images"

# Function to build image
build_image() {
    local image_name=$1
    local dockerfile_path=$2
    local image_tag="latest"
    
    echo "Building ${image_name}:${image_tag}..."
    echo "  Path: ${dockerfile_path}"
    
    docker build -t "bigdata-platform-${image_name}:${image_tag}" "${dockerfile_path}"
    
    if [ $? -eq 0 ]; then
        echo "✓ ${image_name} built successfully!"
    else
        echo "✗ Failed to build ${image_name}"
        exit 1
    fi
    echo ""
}

# Function to copy configs to image build context
prepare_configs() {
    local image_name=$1
    local config_source=$2
    local config_dest="${IMAGES_DIR}/${image_name}/config"
    
    # Create config directory if not exists
    mkdir -p "${config_dest}"
    
    # Copy configs if they exist
    if [ -d "${config_source}" ]; then
        cp -r "${config_source}"/* "${config_dest}/" 2>/dev/null || true
    fi
}

echo "Step 1: Building Base Image"
echo "----------------------------"
prepare_configs "base" "${IMAGES_DIR}/../config"
build_image "base" "${IMAGES_DIR}/base"

echo "Step 2: Building Hadoop Image"
echo "------------------------------"
prepare_configs "hadoop" "${IMAGES_DIR}/../config/hadoop"
build_image "hadoop" "${IMAGES_DIR}/hadoop"

echo "Step 3: Building Spark Image"
echo "----------------------------"
prepare_configs "spark" "${IMAGES_DIR}/../config/spark"
build_image "spark" "${IMAGES_DIR}/spark"

echo "Step 4: Building Hive Image"
echo "---------------------------"
prepare_configs "hive" "${IMAGES_DIR}/../config/hive"
build_image "hive" "${IMAGES_DIR}/hive"

echo "Step 5: Building Additional Services"
echo "-------------------------------------"

# NiFi
build_image "nifi" "${IMAGES_DIR}/nifi"

# Kafka
build_image "kafka" "${IMAGES_DIR}/kafka"

# ZooKeeper
build_image "zookeeper" "${IMAGES_DIR}/zookeeper"

# HBase
prepare_configs "hbase" "${IMAGES_DIR}/../config/hbase"
build_image "hbase" "${IMAGES_DIR}/hbase"

# Flume
build_image "flume" "${IMAGES_DIR}/flume"

# Sqoop
build_image "sqoop" "${IMAGES_DIR}/sqoop"

# Oozie
build_image "oozie" "${IMAGES_DIR}/oozie"

# Mahout
build_image "mahout" "${IMAGES_DIR}/mahout"

# Pig
build_image "pig" "${IMAGES_DIR}/pig"

echo "=============================================="
echo "  All Images Built Successfully!"
echo "=============================================="
echo ""

# List all built images
echo "Built images:"
docker images | grep bigdata-platform

echo ""
echo "To start the platform, run:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To check status:"
echo "  docker-compose ps"