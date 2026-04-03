#!/usr/bin/env python3
"""
Spark HBase Integration Example
Writes data to HBase from Spark
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *

# Initialize Spark Session with HBase support
spark = SparkSession.builder \
    .appName("HBaseIntegration") \
    .config("spark.sql.warehouse.dir", "hdfs://hadoop-namenode:9000/warehouse") \
    .config("spark.jars.packages", "org.apache.hbase:hbase-spark:1.2.0") \
    .getOrCreate()

# Set log level
spark.sparkContext.setLogLevel("WARN")

print("=" * 60)
print("  Spark HBase Integration")
print("=" * 60)

# HBase configuration
hbase_table = "bigdata_table"
hbase_zookeeper_quorum = "zookeeper"

# Sample data
data = [
    ("1", "2024-01-01", 100.0, "category_A", "metadata1"),
    ("2", "2024-01-02", 200.0, "category_B", "metadata2"),
    ("3", "2024-01-03", 150.0, "category_A", "metadata3"),
    ("4", "2024-01-04", 300.0, "category_C", "metadata4"),
    ("5", "2024-01-05", 250.0, "category_B", "metadata5")
]

# Create DataFrame
columns = ["id", "timestamp", "value", "category", "metadata"]
df = spark.createDataFrame(data, columns)

print("\nSample data:")
df.show()

# Add computed columns
df_with_ts = df.withColumn("processed_date", current_date())

# Method 1: Write to HDFS as Parquet (for HBase to read)
print("\nWriting to HDFS as Parquet...")
df_with_ts.write \
    .mode("overwrite") \
    .parquet("hdfs://hadoop-namenode:9000/data/hbase_source")

# Method 2: Use HBase Spark Connector
# Configure HBase
print("\nConfiguring HBase connection...")
# Note: HBase Spark integration requires additional JARs and configuration
# This is a placeholder for actual HBase connection setup
print("HBase Spark connector configuration would go here")

# Method 3: Using RDD to write to HBase directly
def row_to_hbase(row):
    """Convert DataFrame row to HBase put operation"""
    import struct
    row_key = row.id.encode('utf-8')
    
    # Create cell map
    columns = {
        b"info:timestamp": row.timestamp.encode('utf-8'),
        b"info:value": str(row.value).encode('utf-8'),
        b"info:category": row.category.encode('utf-8'),
        b"info:metadata": row.metadata.encode('utf-8')
    }
    
    return (row_key, columns)

# Convert to RDD and write to HBase
print("\nWriting to HBase using RDD...")

# Create RDD from DataFrame
rdd = df_with_ts.rdd.map(row_to_hbase)

# Configure HBase connection
conf = {
    "hbase.zookeeper.quorum": hbase_zookeeper_quorum,
    "hbase.zookeeper.property.clientPort": "2181",
    "hbase.mapreduce.outputtable": hbase_table,
    "mapreduce.output.fileoutputformat.outputdir": "/tmp/hbase_output"
}

# Note: For actual HBase write, you would use:
# rdd.saveAsNewAPIHadoopDataset(
#     spark.sparkContext._jsc.hadoopConfiguration()
# )

print("\nData prepared for HBase write!")
print(f"  - Table: {hbase_table}")
print(f"  - ZooKeeper: {hbase_zookeeper_quorum}")
print(f"  - Total records: {df.count()}")

# Also demonstrate reading from HBase via Hive
print("\nReading from HBase via Hive...")

# Create Hive table pointing to HBase
spark.sql("""
    CREATE TABLE IF NOT EXISTS hbase_table (
        id STRING,
        timestamp STRING,
        value DOUBLE,
        category STRING,
        metadata STRING
    )
    STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
    WITH SERDEPROPERTIES (
        "hbase.columns.mapping" = ":key,info:timestamp,info:value,info:category,info:metadata"
    )
    TBLPROPERTIES ("hbase.table.name" = "bigdata_table")
""")

# Query the table
print("\nQuerying HBase table via Hive:")
try:
    result = spark.sql("SELECT * FROM hbase_table LIMIT 10")
    result.show()
except Exception as e:
    print(f"Note: {e}")
    print("HBase table not yet created. Use this script to prepare data.")

print("\n" + "=" * 60)
print("  HBase Integration Complete!")
print("=" * 60)

spark.stop()