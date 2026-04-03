import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.message)
    return Promise.reject(error)
  }
)

// ==================== Service Status API ====================

export const getServiceStatus = async () => {
  // Simulated service status for demonstration
  // In production, these would be actual API calls to each service
  return {
    services: [
      { name: 'ZooKeeper', status: 'running', port: 2181, uptime: '2h 15m' },
      { name: 'Kafka', status: 'running', port: 9092, uptime: '2h 14m' },
      { name: 'Hadoop NameNode', status: 'running', port: 9000, uptime: '2h 13m' },
      { name: 'Hadoop DataNode', status: 'running', port: 9864, uptime: '2h 12m' },
      { name: 'YARN ResourceManager', status: 'running', port: 8088, uptime: '2h 11m' },
      { name: 'Spark Master', status: 'running', port: 7077, uptime: '2h 10m' },
      { name: 'Spark Worker', status: 'running', port: 8081, uptime: '2h 9m' },
      { name: 'Hive Metastore', status: 'running', port: 9083, uptime: '2h 8m' },
      { name: 'HBase Master', status: 'running', port: 16000, uptime: '2h 7m' },
      { name: 'PostgreSQL', status: 'running', port: 5432, uptime: '2h 20m' }
    ]
  }
}

// ==================== HDFS API ====================

export const getHdfsStatus = async () => {
  return {
    totalCapacity: '50 GB',
    usedCapacity: '12.5 GB',
    remainingCapacity: '37.5 GB',
    files: 245,
    directories: 18
  }
}

export const listHdfsDirectory = async (path = '/') => {
  // Simulated file list
  const mockFiles = {
    '/': [
      { name: 'user', type: 'directory', size: 0, modified: '2024-01-15 10:30:00' },
      { name: 'warehouse', type: 'directory', size: 0, modified: '2024-01-15 09:00:00' },
      { name: 'tmp', type: 'directory', size: 0, modified: '2024-01-15 08:00:00' },
      { name: 'data', type: 'directory', size: 0, modified: '2024-01-14 15:30:00' }
    ],
    '/user': [
      { name: 'hadoop', type: 'directory', size: 0, modified: '2024-01-15 10:30:00' },
      { name: 'spark', type: 'directory', size: 0, modified: '2024-01-15 09:30:00' },
      { name: 'hive', type: 'directory', size: 0, modified: '2024-01-15 08:30:00' }
    ],
    '/user/hadoop': [
      { name: 'data.txt', type: 'file', size: '1.2 GB', modified: '2024-01-15 10:30:00' },
      { name: 'logs.log', type: 'file', size: '256 MB', modified: '2024-01-15 09:30:00' }
    ]
  }
  
  return {
    path,
    files: mockFiles[path] || []
  }
}

export const createHdfsDirectory = async (path) => {
  return { success: true, path }
}

export const deleteHdfsPath = async (path) => {
  return { success: true, path }
}

// ==================== Kafka API ====================

export const getKafkaStatus = async () => {
  return {
    topics: 8,
    brokers: 1,
    partitions: 24,
    messagesPerSecond: 1250
  }
}

export const listKafkaTopics = async () => {
  return {
    topics: [
      { name: 'raw-data', partitions: 3, replicationFactor: 1, messages: 15420 },
      { name: 'processed-data', partitions: 3, replicationFactor: 1, messages: 8750 },
      { name: 'events', partitions: 3, replicationFactor: 1, messages: 42300 },
      { name: 'logs', partitions: 1, replicationFactor: 1, messages: 156000 },
      { name: 'analytics', partitions: 3, replicationFactor: 1, messages: 5200 }
    ]
  }
}

export const createKafkaTopic = async (topicName, partitions = 3) => {
  return { success: true, topic: topicName, partitions }
}

export const deleteKafkaTopic = async (topicName) => {
  return { success: true, topic: topicName }
}

export const getKafkaTopicMessages = async (topicName, limit = 100) => {
  // Simulated messages
  return {
    topic: topicName,
    messages: [
      { key: 'user-001', value: '{"userId": "001", "action": "click", "timestamp": "2024-01-15T10:30:00Z"}', partition: 0, offset: 15417 },
      { key: 'user-002', value: '{"userId": "002", "action": "view", "timestamp": "2024-01-15T10:29:55Z"}', partition: 1, offset: 15418 },
      { key: 'user-003', value: '{"userId": "003", "action": "purchase", "timestamp": "2024-01-15T10:29:50Z"}', partition: 2, offset: 15419 }
    ].slice(0, limit)
  }
}

// ==================== Spark API ====================

export const getSparkStatus = async () => {
  return {
    master: 'spark://spark-master:7077',
    workers: 1,
    cores: 4,
    memory: '8 GB',
    runningJobs: 2,
    completedJobs: 45,
    failedJobs: 3
  }
}

export const listSparkJobs = async () => {
  return {
    jobs: [
      { id: 'job-001', name: 'DataProcessing', status: 'running', progress: 65, started: '2024-01-15T10:00:00Z', duration: '30m' },
      { id: 'job-002', name: 'ETL-Pipeline', status: 'completed', progress: 100, started: '2024-01-15T09:00:00Z', duration: '45m' },
      { id: 'job-003', name: 'Analytics-Report', status: 'completed', progress: 100, started: '2024-01-15T08:00:00Z', duration: '1h 20m' },
      { id: 'job-004', name: 'ML-Training', status: 'failed', progress: 45, started: '2024-01-15T07:30:00Z', duration: '2h', error: 'OutOfMemory' }
    ]
  }
}

export const submitSparkJob = async (jobConfig) => {
  return { 
    success: true, 
    jobId: `job-${Date.now()}`,
    message: 'Job submitted successfully'
  }
}

// ==================== Hive API ====================

export const getHiveStatus = async () => {
  return {
    databases: 5,
    tables: 28,
    queriesPerDay: 156,
    avgQueryTime: '2.3s'
  }
}

export const listHiveDatabases = async () => {
  return {
    databases: [
      { name: 'default', tables: 12, location: 'hdfs://hadoop-namenode:9000/warehouse' },
      { name: 'raw_data', tables: 8, location: 'hdfs://hadoop-namenode:9000/warehouse/raw_data' },
      { name: 'analytics', tables: 5, location: 'hdfs://hadoop-namenode:9000/warehouse/analytics' },
      { name: 'ml_features', tables: 3, location: 'hdfs://hadoop-namenode:9000/warehouse/ml_features' }
    ]
  }
}

export const listHiveTables = async (database) => {
  const mockTables = {
    raw_data: [
      { name: 'users', type: 'external', size: '2.5 GB', rows: 1500000 },
      { name: 'events', type: 'managed', size: '8.2 GB', rows: 8500000 },
      { name: 'transactions', type: 'external', size: '5.1 GB', rows: 3200000 }
    ],
    analytics: [
      { name: 'daily_stats', type: 'managed', size: '120 MB', rows: 45000 },
      { name: 'user_aggregates', type: 'managed', size: '350 MB', rows: 1500000 },
      { name: 'product_metrics', type: 'external', size: '890 MB', rows: 52000 }
    ]
  }
  
  return {
    database,
    tables: mockTables[database] || []
  }
}

export const executeHiveQuery = async (query) => {
  // Simulated query execution
  return {
    success: true,
    queryId: `query-${Date.now()}`,
    result: {
      columns: ['id', 'count', 'avg_value'],
      rows: [
        { id: 'A', count: 150, avg_value: 25.5 },
        { id: 'B', count: 230, avg_value: 18.3 },
        { id: 'C', count: 180, avg_value: 32.1 }
      ],
      executionTime: '1.2s'
    }
  }
}

// ==================== Metrics API ====================

export const getPlatformMetrics = async () => {
  return {
    timestamp: new Date().toISOString(),
    cpu: {
      used: 45,
      total: 100
    },
    memory: {
      used: 6.2,
      total: 16,
      percentage: 38.75
    },
    storage: {
      used: 12.5,
      total: 50,
      percentage: 25
    },
    network: {
      incoming: '125 MB/s',
      outgoing: '85 MB/s'
    },
    services: {
      healthy: 10,
      degraded: 0,
      down: 0
    }
  }
}

export const getMetricsHistory = async (hours = 24) => {
  const points = []
  const now = new Date()
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    points.push({
      timestamp: time.toISOString(),
      cpu: Math.floor(Math.random() * 40) + 30,
      memory: Math.floor(Math.random() * 20) + 25,
      storage: 25,
      kafkaMessages: Math.floor(Math.random() * 1000) + 500,
      hdfsOps: Math.floor(Math.random() * 50) + 10
    })
  }
  
  return { metrics: points }
}

export default api