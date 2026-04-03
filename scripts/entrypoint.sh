#!/bin/bash

# Big Data Platform - Universal Entrypoint Script

set -e

echo "=============================================="
echo "  Big Data Platform - Starting Services"
echo "=============================================="

# Function to wait for a service
wait_for_service() {
    local host=$1
    local port=$2
    local service=$3
    local max_attempts=${4:-30}
    local attempt=1
    
    echo "Waiting for $service at $host:$port..."
    while ! nc -z "$host" "$port" 2>/dev/null; do
        if [ $attempt -ge $max_attempts ]; then
            echo "ERROR: $service not available after $max_attempts attempts"
            return 1
        fi
        echo "  Attempt $attempt/$max_attempts - $service not ready, waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo "$service is ready!"
    return 0
}

# Function to initialize HDFS
init_hdfs() {
    echo "Initializing HDFS..."
    export HADOOP_HOME=/opt/hadoop
    export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
    
    # Format namenode if not exists
    if [ ! -d "/hadoop/hdfs/namenode/current" ]; then
        echo "Formatting namenode..."
        $HADOOP_HOME/bin/hdfs namenode -format -force -nonInteractive
    fi
    
    # Create HDFS directories
    echo "Creating HDFS directories..."
    $HADOOP_HOME/bin/hdfs dfs -mkdir -p /user/hadoop
    $HADOOP_HOME/bin/hdfs dfs -mkdir -p /warehouse
    $HADOOP_HOME/bin/hdfs dfs -mkdir -p /tmp
    $HADOOP_HOME/bin/hdfs dfs -chmod -R 777 /tmp
    $HADOOP_HOME/bin/hdfs dfs -chmod -R 777 /warehouse
    
    echo "HDFS initialization complete!"
}

# Main execution
case "${SERVICE_NAME:-all}" in
    zookeeper)
        echo "Starting ZooKeeper..."
        echo "1" > /var/lib/zookeeper/myid
        exec /opt/zookeeper/bin/zkServer.sh start-foreground
        ;;
        
    kafka)
        wait_for_service zookeeper 2181 "ZooKeeper"
        echo "Starting Kafka..."
        exec /opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
        ;;
        
    hadoop-namenode)
        init_hdfs
        echo "Starting NameNode..."
        exec /opt/hadoop/bin/hdfs namenode
        ;;
        
    hadoop-datanode)
        wait_for_service hadoop-namenode 9000 "NameNode"
        echo "Starting DataNode..."
        exec /opt/hadoop/bin/hdfs datanode
        ;;
        
    hadoop-resourcemanager)
        wait_for_service hadoop-namenode 9000 "NameNode"
        echo "Starting ResourceManager..."
        exec /opt/hadoop/bin/yarn resourcemanager
        ;;
        
    hadoop-nodemanager)
        wait_for_service hadoop-resourcemanager 8032 "ResourceManager"
        echo "Starting NodeManager..."
        exec /opt/hadoop/bin/yarn nodemanager
        ;;
        
    hbase-master)
        wait_for_service zookeeper 2181 "ZooKeeper"
        wait_for_service hadoop-namenode 9000 "NameNode"
        echo "Starting HBase Master..."
        exec /opt/hbase/bin/hbase master start
        ;;
        
    hbase-regionserver)
        wait_for_service hbase-master 16000 "HBase Master"
        echo "Starting HBase RegionServer..."
        exec /opt/hbase/bin/hbase regionserver start
        ;;
        
    hive-metastore)
        wait_for_service postgres 5432 "PostgreSQL"
        wait_for_service hadoop-namenode 9000 "NameNode"
        echo "Starting Hive Metastore..."
        exec /opt/hive/bin/hive --service metastore
        ;;
        
    hive-server)
        wait_for_service hive-metastore 9083 "Hive Metastore"
        echo "Starting Hive Server..."
        exec /opt/hive/bin/hive --service hiveserver2
        ;;
        
    spark-master)
        wait_for_service hadoop-namenode 9000 "NameNode"
        echo "Starting Spark Master..."
        exec /opt/spark/bin/spark-class org.apache.spark.deploy.master.Master
        ;;
        
    spark-worker)
        wait_for_service spark-master 7077 "Spark Master"
        echo "Starting Spark Worker..."
        exec /opt/spark/bin/spark-class org.apache.spark.deploy.worker.Worker ${SPARK_MASTER:-spark://spark-master:7077}
        ;;
        
    nifi)
        wait_for_service zookeeper 2181 "ZooKeeper"
        echo "Starting NiFi..."
        exec /opt/nifi/current/bin/nifi.sh run
        ;;
        
    *)
        echo "Usage: SERVICE_NAME=<service> ./entrypoint.sh"
        echo "Available services: zookeeper, kafka, hadoop-namenode, hadoop-datanode,"
        echo "  hadoop-resourcemanager, hadoop-nodemanager, hbase-master, hbase-regionserver,"
        echo "  hive-metastore, hive-server, spark-master, spark-worker, nifi"
        exec /bin/bash
        ;;
esac