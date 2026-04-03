import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  alpha
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Storage as HdfsIcon,
  Hub as KafkaIcon,
  Bolt as SparkIcon,
  TableChart as HiveIcon,
  CheckCircle as ServiceIcon,
  Menu as MenuIcon,
  Analytics
} from '@mui/icons-material'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/hdfs', label: 'HDFS Explorer', icon: <HdfsIcon /> },
  { path: '/kafka', label: 'Kafka Manager', icon: <KafkaIcon /> },
  { path: '/spark', label: 'Spark Jobs', icon: <SparkIcon /> },
  { path: '/hive', label: 'Hive Queries', icon: <HiveIcon /> },
  { path: '/services', label: 'Service Status', icon: <ServiceIcon /> }
]

const Sidebar = ({ open, toggleSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 280 : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 72,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Analytics sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        {open && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              Big Data
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Platform
            </Typography>
          </Box>
        )}
        <IconButton onClick={toggleSidebar} sx={{ ml: 'auto', color: 'text.secondary' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  background: (theme) => 
                    `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 100%)`,
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    background: (theme) => alpha(theme.palette.primary.main, 0.1)
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary'
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 400
                    }
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {open && (
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Platform Version
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Apache Ecosystem 2024
            </Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}

export default Sidebar