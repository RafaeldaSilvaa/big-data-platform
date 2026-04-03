#!/bin/bash

# Build images in dependency order
# This script ensures images are built in the correct sequence to resolve dependencies

set -e

echo "Building Big Data Platform Docker images in dependency order..."
echo ""

# Layer 1: Base image
echo "[1/4] Building base image..."
docker build -t bigdata-platform-base:latest -f images/base/Dockerfile .

# Layer 2: Hadoop (depends on base)
echo "[2/4] Building Hadoop image..."
docker build -t bigdata-platform-hadoop:latest -f images/hadoop/Dockerfile .

# Layer 3: Services that depend on Hadoop
echo "[3/4] Building services (Hive, HBase, Sqoop, Oozie, Pig, Mahout)..."
docker build -t bigdata-platform-hive:latest -f images/hive/Dockerfile .
docker build -t bigdata-platform-hbase:latest -f images/hbase/Dockerfile .
docker build -t bigdata-platform-sqoop:latest -f images/sqoop/Dockerfile .
docker build -t bigdata-platform-oozie:latest -f images/oozie/Dockerfile .
docker build -t bigdata-platform-pig:latest -f images/pig/Dockerfile .
docker build -t bigdata-platform-mahout:latest -f images/mahout/Dockerfile .

# Layer 4: Independent services
echo "[4/4] Building independent services..."
docker build -t bigdata-platform-zookeeper:latest -f images/zookeeper/Dockerfile .
docker build -t bigdata-platform-kafka:latest -f images/kafka/Dockerfile .
docker build -t bigdata-platform-spark:latest -f images/spark/Dockerfile .
docker build -t bigdata-platform-nifi:latest -f images/nifi/Dockerfile .
docker build -t bigdata-platform-flume:latest -f images/flume/Dockerfile .

echo ""
echo "✅ All images built successfully!"
docker images | grep bigdata-platform
