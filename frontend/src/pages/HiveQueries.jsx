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
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Divider
} from '@mui/material'
import {
  Database,
  TableChart,
  PlayArrow,
  Refresh,
  Storage,
  Speed,
  ExpandMore,
  Collapse
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { getHiveStatus, listHiveDatabases, listHiveTables, executeHiveQuery } from '../services/api'

const HiveQueries = () => {
  const [databases, setDatabases] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedDb, setSelectedDb] = useState(null)
  const [tables, setTables] = useState([])
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [expandedDb, setExpandedDb] = useState(null)
  const [tabValue, setTabValue] = useState(0)

  const loadDatabases = async () => {
    try {
      const [dbData, statsData] = await Promise.all([
        listHiveDatabases(),
        getHiveStatus()
      ])
      setDatabases(dbData.databases)
      setStats(statsData)
    } catch (error) {
      toast.error('Failed to load databases')
    }
  }

  useEffect(() => {
    loadDatabases()
  }, [])

  const loadTables = async (dbName) => {
    try {
      const data = await listHiveTables(dbName)
      setTables(data.tables)
    } catch (error) {
      toast.error('Failed to load tables')
    }
  }

  const handleDbClick = (db) => {
    setSelectedDb(db.name)
    loadTables(db.name)
    if (expandedDb === db.name) {
      setExpandedDb(null)
    } else {
      setExpandedDb(db.name)
    }
  }

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      toast.error('Query is required')
      return
    }
    
    setQueryLoading(true)
    try {
      const result = await executeHiveQuery(query)
      setQueryResult(result.result)
      toast.success('Query executed successfully')
    } catch (error) {
      toast.error('Failed to execute query')
    } finally {
      setQueryLoading(false)
    }
  }

  const insertQueryTemplate = (template) => {
    setQuery(template)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Hive Queries
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Query and manage Hive tables
          </Typography>
        </Box>
        <IconButton onClick={loadDatabases}>
          <Refresh />
        </IconButton>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f6c12020 0%, transparent 100%)', border: '1px solid #f6c12030' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Database sx={{ color: '#f6c120' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Databases</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.databases || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #6366f120 0%, transparent 100%)', border: '1px solid #6366f130' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableChart sx={{ color: '#6366f1' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Tables</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.tables || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b98120 0%, transparent 100%)', border: '1px solid #10b98130' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Speed sx={{ color: '#10b981' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Queries/Day</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.queriesPerDay || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ec489920 0%, transparent 100%)', border: '1px solid #ec489930' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Storage sx={{ color: '#ec4899' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Avg Query Time</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.avgQueryTime || '0s'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Query Editor" />
          <Tab label="Databases & Tables" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ p: 2 }}>
            {/* Query Templates */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Templates:</Typography>
              <Button size="small" variant="outlined" onClick={() => insertQueryTemplate('SELECT * FROM table_name LIMIT 10;')}>
                SELECT
              </Button>
              <Button size="small" variant="outlined" onClick={() => insertQueryTemplate('SHOW TABLES;')}>
                SHOW TABLES
              </Button>
              <Button size="small" variant="outlined" onClick={() => insertQueryTemplate('DESCRIBE table_name;')}>
                DESCRIBE
              </Button>
              <Button size="small" variant="outlined" onClick={() => insertQueryTemplate('SELECT COUNT(*) FROM table_name;')}>
                COUNT
              </Button>
              <Button size="small" variant="outlined" onClick={() => insertQueryTemplate('CREATE TABLE IF NOT EXISTS new_table (id INT, name STRING);')}>
                CREATE TABLE
              </Button>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Enter your HiveQL query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Query will be executed on Hive Server
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<PlayArrow />}
                onClick={handleExecuteQuery}
                disabled={queryLoading}
                sx={{ borderRadius: 2 }}
              >
                Execute Query
              </Button>
            </Box>

            {/* Query Results */}
            {queryResult && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Query Results</Typography>
                  <Chip 
                    label={`Execution time: ${queryResult.executionTime}`} 
                    size="small" 
                    sx={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                  />
                </Box>
                
                {queryResult.rows && queryResult.rows.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {queryResult.columns.map((col) => (
                            <TableCell key={col} sx={{ fontWeight: 600 }}>{col}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {queryResult.rows.map((row, idx) => (
                          <TableRow key={idx}>
                            {queryResult.columns.map((col) => (
                              <TableCell key={col}>{row[col]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Query executed successfully. No rows returned.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 2 }}>
            <List>
              {databases.map((db) => (
                <Box key={db.name}>
                  <ListItem 
                    button 
                    onClick={() => handleDbClick(db)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <Database sx={{ mr: 2, color: '#f6c120' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {db.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Chip label={`${db.tables} tables`} size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {db.location}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <ExpandMore />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {expandedDb === db.name && (
                    <Box sx={{ pl: 6, pb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Tables in {db.name}:
                      </Typography>
                      <Grid container spacing={1}>
                        {tables.map((table) => (
                          <Grid item xs={12} sm={6} md={4} key={table.name}>
                            <Box sx={{ p: 2, background: 'rgba(255,255,255,0.02)', borderRadius: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <TableChart sx={{ fontSize: 18, color: '#6366f1' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{table.name}</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Type: {table.type}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                Size: {table.size} | Rows: {table.rows?.toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              ))}
            </List>
          </Box>
        )}
      </Card>
    </Box>
  )
}

export default HiveQueries