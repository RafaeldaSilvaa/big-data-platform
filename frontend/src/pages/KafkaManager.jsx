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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid
} from '@mui/material'
import {
  Add,
  Delete,
  Refresh,
  Hub,
  Message
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { getKafkaStatus, listKafkaTopics, createKafkaTopic, deleteKafkaTopic, getKafkaTopicMessages } from '../services/api'

const KafkaManager = () => {
  const [topics, setTopics] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [newTopicPartitions, setNewTopicPartitions] = useState(3)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [messages, setMessages] = useState([])
  const [tabValue, setTabValue] = useState(0)

  const loadTopics = async () => {
    setLoading(true)
    try {
      const data = await listKafkaTopics()
      setTopics(data.topics)
      
      const statusData = await getKafkaStatus()
      setStats(statusData)
    } catch (error) {
      toast.error('Failed to load Kafka topics')
    } finally {
      setLoading(false)
    }
  }

  const loadTopicMessages = async (topic) => {
    try {
      const data = await getKafkaTopicMessages(topic)
      setMessages(data.messages)
      setSelectedTopic(topic)
    } catch (error) {
      toast.error('Failed to load messages')
    }
  }

  useEffect(() => {
    loadTopics()
  }, [])

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) {
      toast.error('Topic name is required')
      return
    }
    
    try {
      await createKafkaTopic(newTopicName, newTopicPartitions)
      toast.success(`Topic ${newTopicName} created successfully`)
      setCreateDialogOpen(false)
      setNewTopicName('')
      setNewTopicPartitions(3)
      loadTopics()
    } catch (error) {
      toast.error('Failed to create topic')
    }
  }

  const handleDeleteTopic = async (topicName) => {
    if (!window.confirm(`Are you sure you want to delete topic ${topicName}?`)) return
    
    try {
      await deleteKafkaTopic(topicName)
      toast.success('Topic deleted successfully')
      loadTopics()
    } catch (error) {
      toast.error('Failed to delete topic')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Kafka Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Kafka topics and monitor message streams
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            New Topic
          </Button>
          <IconButton onClick={loadTopics}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #6366f120 0%, transparent 100%)', border: '1px solid #6366f130' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Brokers</Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats?.brokers || 1}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ec489920 0%, transparent 100%)', border: '1px solid #ec489930' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Topics</Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats?.topics || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b98120 0%, transparent 100%)', border: '1px solid #10b98130' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Partitions</Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats?.partitions || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f59e0b20 0%, transparent 100%)', border: '1px solid #f59e0b30' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Messages/sec</Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats?.messagesPerSecond || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Topics" icon={<Hub />} iconPosition="start" />
          <Tab label="Messages" icon={<Message />} iconPosition="start" />
        </Tabs>

        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Topic Name</TableCell>
                  <TableCell>Partitions</TableCell>
                  <TableCell>Replication</TableCell>
                  <TableCell>Messages</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topics.map((topic) => (
                  <TableRow 
                    key={topic.name} 
                    hover
                    onClick={() => { setSelectedTopic(topic.name); setTabValue(1); loadTopicMessages(topic.name); }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#6366f1' }}>
                        {topic.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{topic.partitions}</TableCell>
                    <TableCell>{topic.replicationFactor}</TableCell>
                    <TableCell>
                      <Chip 
                        label={topic.messages.toLocaleString()} 
                        size="small" 
                        sx={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic.name); }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {topics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No topics found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            {selectedTopic ? (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Messages in: {selectedTopic}
                </Typography>
                <List>
                  {messages.map((msg, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        mb: 1, 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: 1,
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#6366f1' }}>
                              Key: {msg.key}
                            </Typography>
                            <Chip label={`Partition: ${msg.partition}`} size="small" />
                            <Chip label={`Offset: ${msg.offset}`} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1, color: 'text.secondary' }}>
                            {msg.value}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Select a topic to view messages
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Card>

      {/* Create Topic Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Topic Name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Partitions"
            value={newTopicPartitions}
            onChange={(e) => setNewTopicPartitions(parseInt(e.target.value) || 1)}
            inputProps={{ min: 1, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTopic} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default KafkaManager