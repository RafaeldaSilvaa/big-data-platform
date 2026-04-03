import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import HdfsExplorer from './pages/HdfsExplorer'
import KafkaManager from './pages/KafkaManager'
import SparkJobs from './pages/SparkJobs'
import HiveQueries from './pages/HiveQueries'
import ServiceStatus from './pages/ServiceStatus'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery('(max-width:900px)')

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: sidebarOpen ? '280px' : '72px',
            transition: 'margin-left 0.3s ease',
            background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
            minHeight: '100vh'
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hdfs" element={<HdfsExplorer />} />
            <Route path="/kafka" element={<KafkaManager />} />
            <Route path="/spark" element={<SparkJobs />} />
            <Route path="/hive" element={<HiveQueries />} />
            <Route path="/services" element={<ServiceStatus />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}

export default App