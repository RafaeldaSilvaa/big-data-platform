import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  LinearProgress,
  IconButton,
  Tabs,
  Tab
} from '@mui/material'
import {
  Add,
  PlayArrow,
  Stop,
  Refresh,
  Timeline,
  Storage,
  Code
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { getSparkStatus, listSparkJobs, submitSparkJob } from '../services/api'

const SparkJobs = () => {
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [jobConfig, setJobConfig] = useState({
    name: '',
    mainClass: '',
    appJar: '',
    arguments: '',
    executorMemory: '2g',
    executorCores: 2,
    numExecutors: 2
  })
  const [tabValue, setTabValue] = useState(0)

  const loadJobs = async () => {
    setLoading(true)
    try {
      const [jobsData, statsData] = await Promise.all([
        listSparkJobs(),
        getSparkStatus()
      ])
      setJobs(jobsData.jobs)
      setStats(statsData)
    } catch (error) {
      toast.error('Failed to load Spark jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleSubmitJob = async () => {
    if (!jobConfig.name || !jobConfig.appJar) {
      toast.error('Job name and JAR are required')
      return
    }
    
    try {
      await submitSparkJob(jobConfig)
      toast.success('Job submitted successfully')
      setSubmitDialogOpen(false)
      setJobConfig({
        name: '',
        mainClass: '',
        appJar: '',
        arguments: '',
        executorMemory: '2g',
        executorCores: 2,
        numExecutors: 2
      })
      loadJobs()
    } catch (error) {
      toast.error('Failed to submit job')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'running': return '#6366f1'
      case 'failed': return '#ef4444'
      default: return '#9ca3af'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Spark Jobs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor Spark applications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={() => setSubmitDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Submit Job
          </Button>
          <IconButton onClick={loadJobs}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #6366f120 0%, transparent 100%)', border: '1px solid #6366f130' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline sx={{ color: '#6366f1' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Running Jobs</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.runningJobs || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b98120 0%, transparent 100%)', border: '1px solid #10b98130' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Storage sx={{ color: '#10b981' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Completed</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.completedJobs || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ef444420 0%, transparent 100%)', border: '1px solid #ef444430' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Stop sx={{ color: '#ef4444' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Failed</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.failedJobs || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ec489920 0%, transparent 100%)', border: '1px solid #ec489930' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code sx={{ color: '#ec4899' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Cores</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.cores || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Master Info */}
      <Card sx={{ mb: 3, p: 2, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Spark Master</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
              {stats?.master || 'spark://spark-master:7077'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">Workers</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats?.workers || 1}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">Total Memory</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{stats?.memory || '8 GB'}</Typography>
          </Box>
        </Box>
      </Card>

      {/* Jobs Table */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="All Jobs" />
          <Tab label="Running" />
          <Tab label="Completed" />
          <Tab label="Failed" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs
                .filter(job => {
                  if (tabValue === 1) return job.status === 'running'
                  if (tabValue === 2) return job.status === 'completed'
                  if (tabValue === 3) return job.status === 'failed'
                  return true
                })
                .map((job) => (
                <TableRow key={job.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {job.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{job.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status} 
                      size="small"
                      sx={{ 
                        textTransform: 'capitalize',
                        background: `${getStatusColor(job.status)}20`,
                        color: getStatusColor(job.status)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={job.progress} 
                        sx={{ width: 80, height: 6, borderRadius: 3 }}
                        color={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'error' : 'primary'}
                      />
                      <Typography variant="caption">{job.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(job.started).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{job.duration}</Typography>
                  </TableCell>
                  <TableCell>
                    {job.error && (
                      <Chip 
                        label={job.error} 
                        size="small" 
                        sx={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No jobs found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Submit Job Dialog */}
      <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Spark Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Name"
                value={jobConfig.name}
                onChange={(e) => setJobConfig({...jobConfig, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Main Class"
                value={jobConfig.mainClass}
                onChange={(e) => setJobConfig({...jobConfig, mainClass: e.target.value})}
                placeholder="com.example.Main"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Application JAR"
                value={jobConfig.appJar}
                onChange={(e) => setJobConfig({...jobConfig, appJar: e.target.value})}
                placeholder="hdfs://path/to/app.jar"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Arguments"
                value={jobConfig.arguments}
                onChange={(e) => setJobConfig({...jobConfig, arguments: e.target.value})}
                placeholder="--arg1 value1 --arg2 value2"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Executor Memory"
                value={jobConfig.executorMemory}
                onChange={(e) => setJobConfig({...jobConfig, executorMemory: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Executor Cores"
                value={jobConfig.executorCores}
                onChange={(e) => setJobConfig({...jobConfig, executorCores: parseInt(e.target.value) || 1})}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Num Executors"
                value={jobConfig.numExecutors}
                onChange={(e) => setJobConfig({...jobConfig, numExecutors: parseInt(e.target.value) || 1})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitJob} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SparkJobs