import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  InputAdornment
} from '@mui/material'
import {
  Folder,
  Description,
  ArrowBack,
  CreateNewFolder,
  Delete,
  Refresh,
  Search,
  Home
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import { getHdfsStatus, listHdfsDirectory, createHdfsDirectory, deleteHdfsPath } from '../services/api'

const FileIcon = ({ type }) => (
  type === 'directory' 
    ? <Folder sx={{ color: '#fbbf24' }} />
    : <Description sx={{ color: '#6366f1' }} />
)

const HdfsExplorer = () => {
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState([])
  const [breadcrumbs, setBreadcrumbs] = useState(['/'])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const loadDirectory = async (path) => {
    setLoading(true)
    try {
      const data = await listHdfsDirectory(path)
      setFiles(data.files)
      setCurrentPath(path)
      
      // Update breadcrumbs
      const parts = path.split('/').filter(Boolean)
      setBreadcrumbs(['/', ...parts])
    } catch (error) {
      toast.error('Failed to load directory')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const data = await getHdfsStatus()
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadDirectory('/')
    loadStats()
  }, [])

  const navigateToPath = (path) => {
    loadDirectory(path)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required')
      return
    }
    
    try {
      const newPath = currentPath === '/' ? `/${newFolderName}` : `${currentPath}/${newFolderName}`
      await createHdfsDirectory(newPath)
      toast.success('Folder created successfully')
      setNewFolderOpen(false)
      setNewFolderName('')
      loadDirectory(currentPath)
    } catch (error) {
      toast.error('Failed to create folder')
    }
  }

  const handleDelete = async (path) => {
    if (!window.confirm(`Are you sure you want to delete ${path}?`)) return
    
    try {
      await deleteHdfsPath(path)
      toast.success('Deleted successfully')
      loadDirectory(currentPath)
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const filteredFiles = searchQuery
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            HDFS Explorer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse and manage HDFS filesystem
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>
            }}
            sx={{ width: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<CreateNewFolder />}
            onClick={() => setNewFolderOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            New Folder
          </Button>
          <IconButton onClick={() => loadDirectory(currentPath)}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="body2" color="text.secondary">Total Capacity</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.totalCapacity || '50 GB'}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="body2" color="text.secondary">Used</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#10b981' }}>{stats?.usedCapacity || '12.5 GB'}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="body2" color="text.secondary">Remaining</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#6366f1' }}>{stats?.remainingCapacity || '37.5 GB'}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="body2" color="text.secondary">Files</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.files || 245}</Typography>
        </Card>
      </Box>

      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs>
          {breadcrumbs.map((crumb, index) => (
            index === breadcrumbs.length - 1 ? (
              <Chip 
                key={index} 
                label={crumb || 'Root'} 
                size="small" 
                sx={{ background: 'rgba(99,102,241,0.2)' }}
              />
            ) : (
              <Link
                key={index}
                component="button"
                variant="body2"
                onClick={() => navigateToPath('/' + breadcrumbs.slice(1, index + 1).join('/'))}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
              >
                {index === 0 ? <Home sx={{ fontSize: 16, mr: 0.5 }} /> : null}
                {crumb || 'Root'}
              </Link>
            )
          ))}
        </Breadcrumbs>
      </Box>

      {/* File List */}
      <Card>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Modified</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPath !== '/' && (
                <TableRow 
                  hover 
                  onClick={() => navigateToPath(currentPath.split('/').slice(0, -1).join('/') || '/')}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ArrowBack sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">..</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>Parent Directory</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell />
                </TableRow>
              )}
              {filteredFiles.map((file) => (
                <TableRow 
                  key={file.name}
                  hover
                  onClick={() => file.type === 'directory' && navigateToPath(currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`)}
                  sx={{ cursor: file.type === 'directory' ? 'pointer' : 'default' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileIcon type={file.type} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {file.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={file.type} 
                      size="small" 
                      sx={{ 
                        textTransform: 'capitalize',
                        background: file.type === 'directory' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: file.type === 'directory' ? '#fbbf24' : '#6366f1'
                      }}
                    />
                  </TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.modified}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleDelete(currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`) }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No files found in this directory
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* New Folder Dialog */}
      <Dialog open={newFolderOpen} onClose={() => setNewFolderOpen(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default HdfsExplorer