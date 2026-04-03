#!/bin/bash

# Kafka Initialization Script
# Creates initial topics for the platform

set -e

echo "=============================================="
echo "  Kafka Initialization"
echo "=============================================="

export KAFKA_HOME=/opt/kafka

# Wait for ZooKeeper
ZOOKEEPER_HOST=${1:-zookeeper}
ZOOKEEPER_PORT=${2:-2181}

echo "Waiting for ZooKeeper at $ZOOKEEPER_HOST:$ZOOKEEPER_PORT..."

max_attempts=30
attempt=1
while ! nc -z "$ZOOKEEPER_HOST" "$ZOOKEEPER_PORT" 2>/dev/null; do
    if [ $attempt -ge $max_attempts ]; then
        echo "ERROR: ZooKeeper not available after $max_attempts attempts"
        exit 1
    fi
    echo "  Attempt $attempt/$max_attempts - ZooKeeper not ready, waiting..."
    sleep 2
    attempt=$((attempt + 1))
done

echo "ZooKeeper is available!"

# Create topics
echo "Creating Kafka topics..."

# Data ingestion topic
$KAFKA_HOME/bin/kafka-topics.sh \
    --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 3 \
    --topic raw-data

# Processed data topic
$KAFKA_HOME/bin/kafka-topics.sh \
    --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 3 \
    --topic processed-data

# Events topic
$KAFKA_HOME/bin/kafka-topics.sh \
    --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 3 \
    --topic events

# Logs topic
$KAFKA_HOME/bin/kafka-topics.sh \
    --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 1 \
    --topic logs

# List all topics
echo ""
echo "Listing all topics:"
$KAFKA_HOME/bin/kafka-topics.sh \
    --list \
    --bootstrap-server localhost:9092

echo ""
echo "=============================================="
echo "  Kafka Initialization Complete!"
echo "=============================================="

exit 0