#!/usr/bin/env python3
"""
Spark Streaming Pipeline Example
Reads data from Kafka and writes to HDFS
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import (from_json, col, current_timestamp, to_timestamp, 
                                    year, month, dayofmonth, hour, count, avg, min, max, 
                                    window, to_json, struct)
from pyspark.sql.types import *

# Initialize Spark Session with Kafka and Hive support
spark = SparkSession.builder \
    .appName("StreamingPipeline") \
    .config("spark.sql.warehouse.dir", "hdfs://hadoop-namenode:9000/warehouse") \
    .config("spark.sql.catalogImplementation", "hive") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1") \
    .enableHiveSupport() \
    .getOrCreate()

# Set log level
spark.sparkContext.setLogLevel("WARN")

print("=" * 60)
print("  Spark Streaming Pipeline")
print("=" * 60)

# Kafka configuration
kafka_bootstrap_servers = "kafka:9092"
input_topic = "raw-data"
output_topic = "processed-data"

# Define schema for incoming data
data_schema = StructType([
    StructField("id", StringType(), True),
    StructField("timestamp", StringType(), True),
    StructField("value", DoubleType(), True),
    StructField("category", StringType(), True),
    StructField("metadata", StringType(), True)
])

# Read from Kafka
print(f"\nReading from Kafka topic: {input_topic}")
print(f"Bootstrap servers: {kafka_bootstrap_servers}")

raw_df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
    .option("subscribe", input_topic) \
    .option("startingOffsets", "earliest") \
    .load()

# Parse JSON data
parsed_df = raw_df \
    .select(from_json(col("value").cast("string"), data_schema).alias("data")) \
    .select("data.*")

# Add processing timestamp
processed_df = parsed_df \
    .withColumn("processed_timestamp", current_timestamp()) \
    .withColumn("year", year(to_timestamp(col("timestamp")))) \
    .withColumn("month", month(to_timestamp(col("timestamp")))) \
    .withColumn("day", dayofmonth(to_timestamp(col("timestamp")))) \
    .withColumn("hour", hour(to_timestamp(col("timestamp"))))

# Data quality checks
valid_data = processed_df.filter(col("value").isNotNull())

# Aggregation by category (window of 5 minutes)
agg_df = valid_data \
    .groupBy(
        window(col("processed_timestamp"), "5 minutes"),
        col("category")
    ) \
    .agg(
        count("*").alias("count"),
        avg("value").alias("avg_value"),
        min("value").alias("min_value"),
        max("value").alias("max_value")
    )

# Write to console (for debugging)
console_query = valid_data \
    .writeStream \
    .format("console") \
    .option("truncate", "false") \
    .start()

# Write aggregated data to Kafka
kafka_output = agg_df \
    .select(
        to_json(struct("*")).alias("value")
    ) \
    .writeStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
    .option("topic", output_topic) \
    .option("checkpointLocation", "/tmp/spark/checkpoints/kafka") \
    .start()

# Write raw data to HDFS as JSON
hdfs_query = valid_data \
    .writeStream \
    .format("json") \
    .option("path", "hdfs://hadoop-namenode:9000/data/streaming") \
    .option("checkpointLocation", "/tmp/spark/checkpoints/hdfs") \
    .outputMode("append") \
    .start()

# Write aggregations to Hive
hive_query = agg_df \
    .writeStream \
    .format("parquet") \
    .option("path", "hdfs://hadoop-namenode:9000/warehouse/streaming_analytics") \
    .option("checkpointLocation", "/tmp/spark/checkpoints/hive") \
    .outputMode("append") \
    .start()

print("\nStreaming queries started!")
print("  - Console: debug output")
print("  - Kafka: aggregated data to processed-data topic")
print("  - HDFS: raw data to /data/streaming")
print("  - Hive/Parquet: aggregations to /warehouse/streaming_analytics")

# Wait for termination
spark.streams.awaitAnyTermination()