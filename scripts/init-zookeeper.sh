#!/bin/bash

# ZooKeeper Initialization Script

set -e

echo "=============================================="
echo "  ZooKeeper Initialization"
echo "=============================================="

export ZOOKEEPER_HOME=/opt/zookeeper

# Create myid file
echo "1" > /var/lib/zookeeper/myid
echo "Created ZooKeeper myid: $(cat /var/lib/zookeeper/myid)"

# Create log directory
mkdir -p /var/log/zookeeper

echo "ZooKeeper initialization complete!"
echo "Starting ZooKeeper..."

exec /opt/zookeeper/bin/zkServer.sh start-foreground