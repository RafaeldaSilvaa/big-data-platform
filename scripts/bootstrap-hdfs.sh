#!/bin/bash

# HDFS Bootstrap Script
# Initializes HDFS directories and permissions

set -e

echo "=============================================="
echo "  HDFS Bootstrap - Initializing Directories"
echo "=============================================="

export HADOOP_HOME=/opt/hadoop
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export PATH=$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH

# Wait for namenode to be available
NAMENODE_HOST=${1:-hadoop-namenode}
NAMENODE_PORT=${2:-9000}

echo "Waiting for NameNode at $NAMENODE_HOST:$NAMENODE_PORT..."

max_attempts=30
attempt=1
while ! nc -z "$NAMENODE_HOST" "$NAMENODE_PORT" 2>/dev/null; do
    if [ $attempt -ge $max_attempts ]; then
        echo "ERROR: NameNode not available after $max_attempts attempts"
        exit 1
    fi
    echo "  Attempt $attempt/$max_attempts - NameNode not ready, waiting..."
    sleep 2
    attempt=$((attempt + 1))
done

echo "NameNode is available!"

# Initialize HDFS directories
echo "Creating HDFS directories..."

# User directories
hdfs dfs -mkdir -p /user/hadoop
hdfs dfs -mkdir -p /user/spark
hdfs dfs -mkdir -p /user/hive

# Warehouse directory
hdfs dfs -mkdir -p /warehouse
hdfs dfs -mkdir -p /warehouse.db

# Temp directories
hdfs dfs -mkdir -p /tmp
hdfs dfs -mkdir -p /tmp/hive
hdfs dfs -mkdir -p /tmp/spark

# Spark directories
hdfs dfs -mkdir -p /spark-events
hdfs dfs -mkdir -p /spark-jars

# Set permissions
echo "Setting permissions..."
hdfs dfs -chmod -R 777 /tmp
hdfs dfs -chmod -R 755 /user
hdfs dfs -chmod -R 755 /warehouse

# Verify directories
echo "Verifying HDFS filesystem..."
hdfs dfsadmin -report

echo ""
echo "=============================================="
echo "  HDFS Bootstrap Complete!"
echo "=============================================="
echo ""
echo "HDFS directories created:"
hdfs dfs -ls /

exit 0