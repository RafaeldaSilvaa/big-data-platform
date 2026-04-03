import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Storage as HdfsIcon,
  Hub as KafkaIcon,
  Bolt as SparkIcon,
  TableChart as HiveIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  TrendingUp,
  Memory,
  Speed,
  CloudQueue
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import toast from 'react-hot-toast'
import { getPlatformMetrics, getMetricsHistory, getServiceStatus, listSparkJobs } from '../services/api'

const MetricCard = ({ title, value, subtitle, icon, color = '#6366f1', trend }) => (
  <Card sx={{ 
    height: '100%', 
    background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)`,
    border: `1px solid ${color}30`
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ 
          width: 48, 
          height: 48, 
          borderRadius: 2, 
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        {trend && (
          <Chip 
            size="small" 
            icon={<TrendingUp sx={{ fontSize: 14 }} />}
            label={trend}
            sx={{ 
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontSize: '0.75rem'
            }}
          />
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
)

const ServiceStatusChip = ({ status }) => {
  const config = {
    running: { color: '#10b981', icon: <SuccessIcon />, label: 'Running' },
    stopped: { color: '#ef4444', icon: <ErrorIcon />, label: 'Stopped' },
    degraded: { color: '#f59e0b', icon: <WarningIcon />, label: 'Degraded' }
  }
  const { color, icon, label } = config[status] || config.stopped
  
  return (
    <Chip 
      size="small"
      icon={icon}
      label={label}
      sx={{ 
        background: `${color}20`,
        color,
        fontWeight: 500,
        '& .MuiChip-icon': { color }
      }}
    />
  )
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [metricsHistory, setMetricsHistory] = useState([])
  const [services, setServices] = useState([])
  const [sparkJobs, setSparkJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [metricsData, historyData, servicesData, jobsData] = await Promise.all([
        getPlatformMetrics(),
        getMetricsHistory(12),
        getServiceStatus(),
        listSparkJobs()
      ])
      
      setMetrics(metricsData)
      setMetricsHistory(historyData.metrics)
      setServices(servicesData.services)
      setSparkJobs(jobsData.jobs)
      toast.success('Dashboard data refreshed')
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading && !metrics) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Platform Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring of your Big Data infrastructure
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CPU Usage"
            value={`${metrics?.cpu?.used || 0}%`}
            subtitle={`of ${metrics?.cpu?.total || 100} cores`}
            icon={<Speed sx={{ color: '#6366f1' }} />}
            color="#6366f1"
            trend="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Memory Usage"
            value={`${metrics?.memory?.used || 0} GB`}
            subtitle={`of ${metrics?.memory?.total || 16} GB (${metrics?.memory?.percentage || 0}%)`}
            icon={<Memory sx={{ color: '#ec4899' }} />}
            color="#ec4899"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Storage Used"
            value={`${metrics?.storage?.used || 0} GB`}
            subtitle={`of ${metrics?.storage?.total || 50} GB`}
            icon={<Storage sx={{ color: '#10b981' }} />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Kafka Throughput"
            value="1.2K"
            subtitle="messages per second"
            icon={<CloudQueue sx={{ color: '#f59e0b' }} />}
            color="#f59e0b"
            trend="+12%"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Resource Utilization History
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metricsHistory}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} tickFormatter={(v) => new Date(v).getHours() + ':00'} stroke="#666" />
                  <YAxis stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#6366f1" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                  <Area type="monotone" dataKey="memory" stroke="#ec4899" fillOpacity={1} fill="url(#colorMem)" name="Memory GB" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Service Health
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {metrics?.services?.healthy || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Healthy</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {metrics?.services?.degraded || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Degraded</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {metrics?.services?.down || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">Down</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              {services.slice(0, 5).map((service) => (
                <Box key={service.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="body2">{service.name}</Typography>
                  <ServiceStatusChip status={service.status} />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Jobs */}
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Spark Jobs
          </Typography>
          <Button size="small">View All</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sparkJobs.slice(0, 4).map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {job.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ServiceStatusChip status={job.status === 'completed' ? 'running' : job.status === 'failed' ? 'stopped' : 'degraded'} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={job.progress} 
                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                        color={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'error' : 'primary'}
                      />
                      <Typography variant="caption">{job.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(job.started).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{job.duration}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default Dashboard