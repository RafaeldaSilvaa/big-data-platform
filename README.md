# 🏭 Big Data Platform - Enterprise Data Lake

<p align="center">
  <img src="https://img.shields.io/badge/Apache-Hadoop-FF0129?style=flat&logo=apache" alt="Apache Hadoop">
  <img src="https://img.shields.io/badge/Apache-Spark-E25A1C?style=flat&logo=apache" alt="Apache Spark">
  <img src="https://img.shields.io/badge/Apache-Kafka-231F20?style=flat&logo=apache" alt="Apache Kafka">
  <img src="https://img.shields.io/badge/Apache-Hive-F6C120?style=flat&logo=apache" alt="Apache Hive">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat" alt="License">
</p>

> 🚀 Enterprise-grade End-to-End Big Data Platform built with Apache ecosystem and Docker

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Components](#-components)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Usage Examples](#-usage-examples)
- [Web Interfaces](#-web-interfaces)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [License](#-license)

## 📖 Overview

This is a complete **End-to-End Big Data Platform** designed for enterprise data processing workflows. The platform provides a comprehensive data pipeline from ingestion to processing, storage, and analytics.

### ✨ Key Features

- **Multi-layer Architecture**: Ingestion, Processing, Storage, Query, and Orchestration layers
- **High Availability**: Services configured for production-like environments
- **Scalability**: Modular design allowing horizontal scaling
- **Monitoring**: Web UIs for all major services
- **Data Integration**: RDBMS, streaming, and file-based data sources
- **Machine Learning**: Apache Mahout for ML workloads

### 🎯 Use Cases

1. **Real-time Analytics**: Stream processing with Kafka + Spark Streaming
2. **Batch Processing**: ETL pipelines with Spark and Hive
3. **Data Lake**: HDFS-based storage with Hive queries
4. **NoSQL Operations**: HBase for low-latency read/write workloads
5. **ML Pipelines**: Mahout for machine learning workflows

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BIG DATA PLATFORM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           EXTERNAL CONNECTIONS                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │   │
│  │  │  REST   │  │   CSV    │  │   JSON   │  │  RDBMS   │  │   External   │  │   │
│  │  │   API   │  │   Files  │  │   Events │  │  (SQL)   │  │   Systems    │  │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │   │
│  └───────┼─────────────┼─────────────┼─────────────┼───────────────┼──────────┘   │
│          │             │             │             │               │               │
│  ┌───────┴─────────────┴─────────────┴─────────────┴───────────────┴──────────┐   │
│  │                              INGESTION LAYER                                 │   │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │   │
│  │  │  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌───────────────────────┐  │  │   │
│  │  │  │  NiFi   │   │  Flume  │   │  Sqoop  │   │       Kafka          │  │  │   │
│  │  │  │  (UI)   │   │ (Logs)  │   │(RDBMS)  │   │  ┌─────┬─────┬─────┐ │  │  │   │
│  │  │  │ :8443   │   │ :41414  │   │  :21   │   │  │Brokr│Topics│Part │ │  │  │   │
│  │  │  └─────────┘   └─────────┘   └─────────┘   │  └─────┴─────┴─────┘ │  │  │   │
│  │  │                                      │   │         :9092        │  │  │   │
│  │  └──────────────────────────────────────┴───┴─────────────────────┘──┘  │   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                             PROCESSING LAYER                                │   │
│  │  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐│   │
│  │  │         SPARK CLUSTER            │  │          PIG                     ││   │
│  │  │  ┌─────────┐   ┌─────────────┐  │  │  ┌─────────────────────────────┐││   │
│  │  │  │ Master  │◄──┤   Workers   │  │  │  │   Pig Latin Scripts         │││   │
│  │  │  │  :7077  │   │  :8081      │  │  │  └─────────────────────────────┘││   │
│  │  │  │  :8080  │   └─────────────┘  │  │                                    │   │
│  │  │  └─────────┘                    │  └──────────────────────────────────┘│   │
│  │  │        ▲                        │                                       │   │
│  │  │        │ YARN                   │  ┌──────────────────────────────────┐│   │
│  │  │  ┌─────┴─────┐                  │  │          YARN                   ││   │
│  │  │  │ResourceMgr│                  │  │  ┌──────────┐  ┌──────────────┐││   │
│  │  │  │  :8088   │                  │  │  │ResrcMgr  │  │  NodeMgrs    │││   │
│  │  │  └──────────┘                  │  │  │  :8032   │  │  :8042       │││   │
│  │  │                                │  │  └──────────┘  └──────────────┘││   │
│  │  └────────────────────────────────┘  └──────────────────────────────────┘│   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                              STORAGE LAYER                                   │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐│   │
│  │  │      HDFS           │  │      HBASE          │  │   KAFKA BROKER      ││   │
│  │  │ ┌─────┐ ┌────────┐  │  │ ┌────────┐ ┌──────┐ │  │                     ││   │
│  │  │ │Name │ │  Data  │  │  │ │ Master │ │ Regn  │ │  │   :9092            ││   │
│  │  │ │Node │ │  Nodes │  │  │ │ :16000 │ │ :16030│ │  │                     ││   │
│  │  │ │:9000│ │ :9864  │  │  │ └────────┘ └──────┘ │  │                     ││   │
│  │  │ │:9870│ └────────┘  │  │    :16010           │  │                     ││   │
│  │  │ └─────┘             │  └─────────────────────┘  └─────────────────────┘│   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                          QUERY / METADATA LAYER                             │   │
│  │  ┌────────────────────────────────┐  ┌────────────────────────────────────┐  │   │
│  │  │         HIVE                  │  │         POSTGRESQL                │  │   │
│  │  │  ┌────────┐  ┌────────────┐   │  │  ┌────────────────────────────┐   │  │   │
│  │  │  │Server │  │ Metastore   │   │  │  │      Metastore DB          │   │  │   │
│  │  │  │:10000 │  │   :9083    │   │  │  │        :5432              │   │  │   │
│  │  │  └────────┘  └────────────┘   │  │  └────────────────────────────┘   │  │   │
│  │  │         ▲                      │  └────────────────────────────────────┘  │   │
│  │  │         │ PostgreSQL           │                                        │   │
│  │  └─────────┴──────────────────────┴────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                            ORCHESTRATION LAYER                               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐│   │
│  │  │ ZooKeeper │  │   Oozie    │  │   Mahout   │  │     Application        ││   │
│  │  │  :2181    │  │  :11000    │  │   ML      │  │       Services         ││   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────────────────┘│   │
│  └───────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 📦 Components

### Ingestion Layer
| Component | Version | Port | Description |
|-----------|---------|------|-------------|
| Apache NiFi | 1.25.0 | 8080/8443 | Data ingestion, routing, and transformation |
| Apache Flume | 1.11.0 | 41414 | Log collection and aggregation |
| Apache Kafka | 3.7.0 | 9092 | Distributed streaming platform |
| Apache Sqoop | 1.4.7 | - | RDBMS data import/export |

### Processing Layer
| Component | Version | Port | Description |
|-----------|---------|------|-------------|
| Apache Spark | 3.5.1 | 8080/7077 | Distributed computing engine |
| Apache Pig | 0.17.0 | - | Data flow language |
| YARN | 3.4.0 | 8088 | Resource management |

### Storage Layer
| Component | Version | Port | Description |
|-----------|---------|------|-------------|
| Apache Hadoop HDFS | 3.4.0 | 9000/9870 | Distributed file system |
| Apache HBase | 2.5.7 | 16000/16010 | NoSQL database |

### Query/Metadata Layer
| Component | Version | Port | Description |
|-----------|---------|------|-------------|
| Apache Hive | 3.1.3 | 10000 | SQL query engine |
| PostgreSQL | 15 | 5432 | Metastore database |

### Orchestration Layer
| Component | Version | Port | Description |
|-----------|---------|------|-------------|
| Apache ZooKeeper | 3.9.2 | 2181 | Coordination service |
| Apache Oozie | 5.2.1 | 11000 | Workflow scheduler |
| Apache Mahout | 0.13.1 | - | Machine learning library |

## 🚀 Quick Start

### Prerequisites

```bash
# Minimum requirements
- Docker Engine 20.10+
- Docker Compose 2.0+ (or docker compose plugin)
- 8GB RAM (16GB recommended)
- 50GB Disk Space
```

### Installation (Linux/Mac)

```bash
# 1. Clone or navigate to the project
cd big-data-platform

# 2. Make startup script executable
chmod +x start-platform.sh

# 3. Start the platform (builds images and starts services)
./start-platform.sh --build

# Or start without building
./start-platform.sh
```

### Installation (Windows)

```batch
:: 1. Navigate to the project
cd big-data-platform

:: 2. Start the platform (builds images and starts services)
start-platform.bat --build

:: Or start without building
start-platform.bat
```

### Manual Installation (All Platforms)

```bash
# 1. Clone or navigate to the project
cd big-data-platform

# 2. Build all Docker images (this may take a while)
./build-images.sh

# 3. Start the platform
docker compose up -d

# 4. Check service status
docker compose ps

# 5. View logs
docker compose logs -f
```

### Verify Services

```bash
# Wait for services to start (recommended: 5-10 minutes)
sleep 300

# Check all services are healthy
docker compose ps

# Verify HDFS is working
docker exec -it hadoop-namenode hdfs dfs -ls /

# Test Kafka
docker exec -it kafka kafka-topics.sh --list --bootstrap-server localhost:9092

# Check Spark UI
# Open http://localhost:8080 in your browser
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```bash
# Platform Settings
PLATFORM_NAME=bigdata-platform
NETWORK_NAME=bigdata-network

# Hadoop Settings
HADOOP_NAMENODE_PORT=9000
HADOOP_WEB_PORT=9870
YARN_WEB_PORT=8088

# Kafka Settings
KAFKA_BROKER_PORT=9092
KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181

# Hive Settings
HIVE_PORT=10000
HIVE_METASTORE_PORT=9083

# Resource Limits
SPARK_EXECUTOR_MEMORY=2g
SPARK_EXECUTOR_CORES=2
HADOOP_DATANODE_MEMORY=4g
```

### Port Mapping

| Service | Internal | External | Protocol |
|---------|----------|----------|----------|
| HDFS NameNode | 9000 | 9000 | Hadoop |
| HDFS Web UI | 9870 | 9870 | HTTP |
| YARN ResourceManager | 8088 | 8088 | HTTP |
| Spark Master | 7077 | - | Spark |
| Spark Master UI | 8080 | 8080 | HTTP |
| Spark Worker UI | 8081 | 8081 | HTTP |
| Kafka Broker | 9092 | 9092 | TCP |
| Hive Server | 10000 | 10000 | JDBC |
| Hive Metastore | 9083 | 9083 | Thrift |
| HBase Master | 16000 | 16000 | Thrift |
| HBase Web UI | 16010 | 16010 | HTTP |
| NiFi Web UI | 8443 | 8443 | HTTPS |
| Oozie Web UI | 11000 | 11000 | HTTP |
| PostgreSQL | 5432 | 5432 | PostgreSQL |
| ZooKeeper | 2181 | 2181 | Client |

## 💡 Usage Examples

### 1. Submit Spark Job

```bash
# Run a Spark job
docker exec -it spark-master \
  spark-submit \
    --master spark://spark-master:7077 \
    --class org.apache.spark.examples.SparkPi \
    /opt/spark/examples/jars/spark-examples_2.12-3.5.1.jar 100

# Run with custom configuration
docker exec -it spark-master \
  spark-submit \
    --master spark://spark-master:7077 \
    --deploy-mode cluster \
    --conf spark.executor.memory=4g \
    --conf spark.executor.cores=2 \
    /path/to/your-app.jar
```

### 2. Work with Hive

```bash
# Connect to Hive Server
docker exec -it hive-server \
  beeline -u "jdbc:hive2://localhost:10000"

# Or use Hive CLI
docker exec -it hive-metastore \
  hive

# Execute queries
SHOW DATABASES;
CREATE TABLE test (id INT, name STRING);
DESCRIBE FORMATTED test;
```

### 3. Manage Kafka Topics

```bash
# Create a topic
docker exec -it kafka \
  kafka-topics.sh \
    --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 1 \
    --partitions 3 \
    --topic my-topic

# List topics
docker exec -it kafka \
  kafka-topics.sh --list --bootstrap-server localhost:9092

# Describe topic
docker exec -it kafka \
  kafka-topics.sh \
    --describe \
    --topic my-topic \
    --bootstrap-server localhost:9092

# Produce messages
docker exec -it kafka \
  kafka-console-producer.sh \
    --broker-list localhost:9092 \
    --topic my-topic

# Consume messages
docker exec -it kafka \
  kafka-console-consumer.sh \
    --bootstrap-server localhost:9092 \
    --topic my-topic \
    --from-beginning
```

### 4. HDFS Operations

```bash
# List files
docker exec -it hadoop-namenode hdfs dfs -ls /

# Create directory
docker exec -it hadoop-namenode hdfs dfs -mkdir -p /user/data

# Upload file
docker exec -it hadoop-namenode hdfs dfs -put localfile.txt /user/data/

# Download file
docker exec -it hadoop-namenode hdfs dfs -get /user/data/file.txt

# Check filesystem
docker exec -it hadoop-namenode hdfs dfsadmin -report
```

### 5. Sqoop Data Import

```bash
# Import from PostgreSQL to HDFS
docker exec -it sqoop sqoop import \
  --connect jdbc:postgresql://postgres:5432/hivemetastore \
  --username hive \
  --password hive \
  --table my_table \
  --target-dir /user/hadoop/my_table \
  --fields-terminated-by ','

# Import with query
docker exec -it sqoop sqoop import \
  --connect jdbc:postgresql://postgres:5432/hivemetastore \
  --username hive \
  --password hive \
  --query "SELECT * FROM table WHERE \$CONDITIONS" \
  --target-dir /user/hadoop/output \
  --split-by id
```

### 6. Run Streaming Pipeline

```bash
# Submit Spark Streaming job
docker exec -it spark-master \
  spark-submit \
    --master spark://spark-master:7077 \
    --class org.apache.spark.examples.streaming.JavaNetworkWordCount \
    /opt/spark/examples/jars/spark-streaming-examples_2.12-3.5.1.jar \
    localhost 9999
```

## 🌐 Web Interfaces

### Frontend Dashboard (React Application)

The platform includes a modern **React-based dashboard** for monitoring and interacting with all Big Data services.

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

**Access the frontend at:** http://localhost:3000

The dashboard provides:
- **Dashboard**: Real-time metrics, resource utilization charts, service health
- **HDFS Explorer**: Browse, create, and manage HDFS files and directories
- **Kafka Manager**: Create/delete topics, view messages, monitor throughput
- **Spark Jobs**: Submit jobs, monitor running jobs, view history
- **Hive Queries**: Query editor with templates, database/table browser
- **Service Status**: Real-time status of all platform services

### Backend Services Web UIs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend Dashboard** | http://localhost:3000 | No auth |
| HDFS UI | http://localhost:9870 | No auth |
| YARN UI | http://localhost:8088 | No auth |
| Spark Master | http://localhost:8080 | No auth |
| Spark Worker | http://localhost:8081 | No auth |
| NiFi UI | https://localhost:8443 | No auth |
| HBase UI | http://localhost:16010 | No auth |
| Oozie UI | http://localhost:11000 | admin/admin |

### Quick Access Commands

```bash
# Open all web UIs in browser (Linux)
xdg-open http://localhost:3000  # Frontend
xdg-open http://localhost:9870  # HDFS
xdg-open http://localhost:8088  # YARN
xdg-open http://localhost:8080  # Spark

# Or use curl to verify services
curl -I http://localhost:3000  # Frontend
curl -I http://localhost:9870  # HDFS
curl -I http://localhost:8088  # YARN
```
## 🔍 Troubleshooting

### Common Issues

#### 1. Services Not Starting

```bash
# Check Docker logs
docker compose logs service-name

# Check resource usage
docker stats

# Restart specific service
docker compose restart service-name
```

#### 2. Out of Memory

```bash
# Increase Docker memory in Docker Desktop settings
# Or edit docker-compose.yml to reduce memory limits
```

#### 3. Port Conflicts

```bash
# Check which process is using the port
lsof -i :8080

# Change port in docker-compose.yml
ports:
  - "8082:8080"  # Map external 8082 to internal 8080
```

#### 4. HDFS Not Formatted

```bash
# Format namenode
docker exec -it hadoop-namenode hdfs namenode -format

# Restart HDFS
docker compose restart hadoop-namenode hadoop-datanode
```

#### 5. Kafka Topic Creation Fails

```bash
# Wait for ZooKeeper to be ready
docker exec -it zookeeper zkServer.sh status

# Restart Kafka
docker compose restart kafka
```

### Health Checks

```bash
# Check all container health
docker compose ps

# Test ZooKeeper
docker exec -it zookeeper zkServer.sh status

# Test Kafka
docker exec -it kafka kafka-broker-api-versions.sh --bootstrap-server localhost:9092

# Test HDFS
docker exec -it hadoop-namenode hdfs dfsadmin -safemode get
```

## 📁 Project Structure

```
big-data-platform/
├── docker-compose.yml          # Main orchestration file
├── build-images.sh            # Build script for all images
├── README.md                   # This file
│
├── images/                     # Docker images
│   ├── base/                   # Base image (Ubuntu + JDK)
│   ├── hadoop/                # Hadoop (HDFS + YARN)
│   ├── spark/                 # Spark (Master + Worker)
│   ├── hive/                  # Hive + PostgreSQL driver
│   ├── nifi/                  # NiFi
│   ├── kafka/                 # Kafka
│   ├── zookeeper/             # ZooKeeper
│   ├── hbase/                 # HBase
│   ├── flume/                 # Flume
│   ├── sqoop/                 # Sqoop
│   ├── oozie/                 # Oozie
│   ├── mahout/                # Mahout
│   └── pig/                   # Pig
│
├── config/                    # Configuration files
│   ├── hadoop/                # Hadoop XML configs
│   ├── hive/                  # Hive configs
│   ├── hbase/                 # HBase configs
│   ├── spark/                 # Spark configs
│   ├── kafka/                 # Kafka configs
│   ├── zookeeper/             # ZooKeeper config
│   └── nifi/                  # NiFi config
│
├── scripts/                    # Initialization scripts
│   ├── entrypoint.sh          # Universal entrypoint
│   ├── bootstrap-hdfs.sh      # HDFS initialization
│   ├── init-zookeeper.sh      # ZooKeeper init
│   └── init-kafka.sh          # Kafka topics
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── test.yml           # GitHub Actions
│
└── apps/                      # Sample applications
    ├── spark/                 # Spark applications
    │   ├── streaming_pipeline.py
    │   └── write_hbase.py
    └── hive/                  # Hive queries
        └── create_tables.hql
```

## 📊 Monitoring Commands

```bash
# Container resource usage
docker stats

# View specific service logs
docker compose logs -f spark-master

# Check network connectivity
docker exec -it hadoop-namenode ping -c 3 kafka

# Check service endpoints
curl http://localhost:9870
curl http://localhost:8088
curl http://localhost:8080
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚡ Performance Tips

1. **Resource Allocation**: Adjust memory/CPU in docker-compose.yml based on your hardware
2. **Network**: Use custom networks for better performance
3. **Storage**: Use SSD for better I/O performance
4. **Logs**: Configure log rotation to prevent disk space issues

## 🔗 References

- [Apache Hadoop Documentation](https://hadoop.apache.org/docs/)
- [Apache Spark Documentation](https://spark.apache.org/docs/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Apache Hive Documentation](https://hive.apache.org/)
- [Docker Documentation](https://docs.docker.com/)

---

<p align="center">
  <sub>Built with ❤️ using Apache Technologies</sub>
</p>