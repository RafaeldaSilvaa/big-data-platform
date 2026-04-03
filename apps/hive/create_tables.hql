-- Hive Tables Creation Script
-- Creates tables for the big data platform

-- Set database
CREATE DATABASE IF NOT EXISTS raw_data;
USE raw_data;

-- ============================================
-- EXTERNAL TABLES (Data Lake)
-- ============================================

-- Raw data table (landing zone)
DROP TABLE IF EXISTS raw_data_table;
CREATE EXTERNAL TABLE raw_data_table (
    id STRING,
    timestamp STRING,
    value DOUBLE,
    category STRING,
    metadata STRING,
    processed_timestamp TIMESTAMP
)
COMMENT 'Raw data landing zone'
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs://hadoop-namenode:9000/data/raw';

-- Processed data table
DROP TABLE IF EXISTS processed_data_table;
CREATE EXTERNAL TABLE processed_data_table (
    id STRING,
    timestamp STRING,
    value DOUBLE,
    category STRING,
    year INT,
    month INT,
    day INT,
    hour INT,
    processed_timestamp TIMESTAMP
)
COMMENT 'Processed data zone'
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs://hadoop-namenode:9000/data/processed';

-- ============================================
-- MANAGED TABLES (Warehouse)
-- ============================================

-- Analytics aggregation table
DROP TABLE IF EXISTS streaming_analytics;
CREATE TABLE streaming_analytics (
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    category STRING,
    count BIGINT,
    avg_value DOUBLE,
    min_value DOUBLE,
    max_value DOUBLE
)
COMMENT 'Streaming analytics aggregation'
STORED AS PARQUET
LOCATION 'hdfs://hadoop-namenode:9000/warehouse/streaming_analytics';

-- ============================================
-- PARTITIONED TABLES
-- ============================================

-- Historical data partitioned by date
DROP TABLE IF EXISTS historical_data;
CREATE TABLE historical_data (
    id STRING,
    timestamp STRING,
    value DOUBLE,
    category STRING,
    metadata STRING
)
COMMENT 'Historical data with partitioning'
PARTITIONED BY (year INT, month INT, day INT)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 'hdfs://hadoop-namenode:9000/data/historical';

-- ============================================
-- VIEWS
-- ============================================

-- View for recent data
CREATE OR REPLACE VIEW recent_data AS
SELECT 
    id,
    timestamp,
    value,
    category,
    processed_timestamp
FROM raw_data_table
WHERE processed_timestamp >= DATE_SUB(CURRENT_DATE, 7);

-- View for category summary
CREATE OR REPLACE VIEW category_summary AS
SELECT 
    category,
    COUNT(*) as total_records,
    AVG(value) as average_value,
    MIN(value) as min_value,
    MAX(value) as max_value,
    SUM(value) as total_value
FROM processed_data_table
GROUP BY category;

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Show tables
SHOW TABLES;

-- Describe table
DESCRIBE formatted raw_data_table;

-- Count records
SELECT COUNT(*) FROM raw_data_table;

-- Select sample data
SELECT * FROM raw_data_table LIMIT 10;