import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import {
  Refresh,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Storage,
  Hub,
  Bolt,
  TableChart,
  Cloud,
  Timeline
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { getServiceStatus } from '../services/api'

const serviceIcons = {
  'ZooKeeper': <Cloud sx={{ color: '#10b981' }} />,
  'Kafka': <Hub sx={{ color: '#6366f1' }} />,
  'Hadoop NameNode': <Storage sx={{ color: '#ef4444' }} />,
  'Hadoop DataNode': <Storage sx={{ color: '#ef4444' }} />,
  'YARN ResourceManager': <Timeline sx={{ color: '#f59e0b' }} />,
  'Spark Master': <Bolt sx={{ color: '#ec4899' }} />,
  'Spark Worker': <Bolt sx={{ color: '#ec4899' }} />,
  'Hive Metastore': <TableChart sx={{ color: '#f6c120' }} />,
  'HBase Master': <Storage sx={{ color: '#8b5cf6' }} />,
  'PostgreSQL': <Storage sx={{ color: '#3b82f6' }} />
}

const ServiceStatus = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const loadServices = async () => {
    setLoading(true)
    try {
      const data = await getServiceStatus()
      setServices(data.services)
      setLastUpdate(new Date())
    } catch (error) {
      toast.error('Failed to load service status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
    const interval = setInterval(loadServices, 30000)
    return () => clearInterval(interval)
  }, [])

  const runningCount = services.filter(s => s.status === 'running').length
  const stoppedCount = services.filter(s => s.status === 'stopped').length
  const healthPercentage = services.length > 0 ? Math.round((runningCount / services.length) * 100) : 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Service Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring of all platform services
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {lastUpdate && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
          )}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadServices}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Overall Health */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #10b98120 0%, transparent 100%)',
            border: '1px solid #10b98130'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Overall Health</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {healthPercentage}%
                </Typography>
              </Box>
              <CheckCircle sx={{ fontSize: 48, color: '#10b981' }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={healthPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: 'rgba(16, 185, 129, 0.2)',
                  '& .MuiLinearProgress-bar': { background: '#10b981' }
                }} 
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>{runningCount}</Typography>
                <Typography variant="caption" color="text.secondary">Running</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>0</Typography>
                <Typography variant="caption" color="text.secondary">Degraded</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>{stoppedCount}</Typography>
                <Typography variant="caption" color="text.secondary">Stopped</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Total Services</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>{services.length}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.name}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
              border: service.status === 'running' ? '1px solid #10b98130' : '1px solid #ef444430'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2,
                    background: service.status === 'running' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {serviceIcons[service.name] || <Storage />}
                  </Box>
                  <Chip 
                    label={service.status} 
                    size="small"
                    icon={service.status === 'running' ? <CheckCircle /> : <ErrorIcon />}
                    sx={{ 
                      textTransform: 'capitalize',
                      background: service.status === 'running' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: service.status === 'running' ? '#10b981' : '#ef4444',
                      '& .MuiChip-icon': { color: 'inherit' }
                    }}
                  />
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {service.name}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Port</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{service.port}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">Uptime</Typography>
                    <Typography variant="body2">{service.uptime}</Typography>
                  </Box>
                </Box>

                {service.status !== 'running' && (
                  <Box sx={{ mt: 2, p: 1, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: '#ef4444' }}>
                      Service is not running. Check logs for more details.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Table */}
      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Detailed Status</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Uptime</TableCell>
                <TableCell>Health</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.name} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {serviceIcons[service.name] || <Storage />}
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{service.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={service.status} 
                      size="small"
                      sx={{ 
                        textTransform: 'capitalize',
                        background: service.status === 'running' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: service.status === 'running' ? '#10b981' : '#ef4444'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{service.port}</Typography>
                  </TableCell>
                  <TableCell>{service.uptime}</TableCell>
                  <TableCell>
                    {service.status === 'running' ? (
                      <Tooltip title="Healthy">
                        <CheckCircle sx={{ color: '#10b981' }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Unhealthy">
                        <ErrorIcon sx={{ color: '#ef4444' }} />
                      </Tooltip>
                    )}
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

export default ServiceStatus