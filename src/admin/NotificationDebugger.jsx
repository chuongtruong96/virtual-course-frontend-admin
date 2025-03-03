import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ChevronDown, RefreshCw, AlertTriangle } from 'lucide-react';
import NotificationService from '../services/notificationService';
import useAuth from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';

const NotificationDebugger = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugResults, setDebugResults] = useState(null);
  const { refreshNotifications } = useNotifications(userId);

  const handleDebug = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await NotificationService.debugNotifications(userId);
      setDebugResults(results);
    } catch (err) {
      setError(err.message || 'Failed to debug notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    refreshNotifications();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader 
        title="Notification Debugger" 
        subheader="Troubleshoot notification issues"
      />
      <CardContent>
        <Box display="flex" gap={2} mb={3}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleDebug}
            disabled={loading || !userId}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Debugging...' : 'Debug Notifications'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<RefreshCw size={16} />}
          >
            Refresh Notifications
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center">
              <AlertTriangle size={20} style={{ marginRight: 8 }} />
              <Typography>{error}</Typography>
            </Box>
          </Alert>
        )}
        
        {debugResults && (
          <Box>
            <Typography variant="h6" gutterBottom>Debug Results</Typography>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography>All Notifications ({debugResults.all?.count || 0})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {debugResults.all?.notifications?.length > 0 ? (
                  <List>
                    {debugResults.all.notifications.map((notification) => (
                      <ListItem key={notification.id} divider>
                        <ListItemText
                          primary={notification.content}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                ID: {notification.id}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Type: {notification.type}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Sent: {formatDate(notification.sentAt)}
                              </Typography>
                              <Typography variant="caption" display="block">
                                Read: {notification.isRead ? 'Yes' : 'No'}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip 
                          label={notification.type} 
                          color={notification.isRead ? 'default' : 'primary'} 
                          size="small" 
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No notifications found</Typography>
                )}
              </AccordionDetails>
            </Accordion>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Notifications by Type</Typography>
            
            {Object.entries(debugResults)
              .filter(([key]) => key !== 'all' && key !== 'error')
              .map(([type, data]) => (
                <Accordion key={type}>
                  <AccordionSummary expandIcon={<ChevronDown />}>
                    <Typography>
                      {type} ({data.count || 0})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {data.error ? (
                      <Alert severity="error">{data.error}</Alert>
                    ) : data.notifications?.length > 0 ? (
                      <List>
                        {data.notifications.map((notification) => (
                          <ListItem key={notification.id} divider>
                          <ListItemText
                            primary={notification.content}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  ID: {notification.id}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Sent: {formatDate(notification.sentAt)}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Read: {notification.isRead ? 'Yes' : 'No'}
                                </Typography>
                                {notification.courseId && (
                                  <Typography variant="caption" display="block">
                                    Course ID: {notification.courseId}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <Chip 
                            label={notification.isRead ? 'Read' : 'Unread'} 
                            color={notification.isRead ? 'default' : 'primary'} 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                        </ListItem>
                                                ))}
                                              </List>
                                            ) : (
                                              <Typography color="text.secondary">No notifications found for type: {type}</Typography>
                                            )}
                                          </AccordionDetails>
                                        </Accordion>
                                      ))}
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          );
                        };
                        
                        export default NotificationDebugger;