import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  useTheme, 
  alpha,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { TrendingUp, AlertCircle } from 'lucide-react';

/**
 * StatisticsChart Component
 * 
 * A reusable component for displaying various statistics charts
 * 
 * @param {Object} props
 * @param {string} props.model - Data model to display (total, courses, users, revenue)
 * @param {string} props.filter - Time filter (today, week, month, year, allTime)
 * @param {string} props.title - Chart title
 * @param {string} props.chartType - Type of chart (line, bar, area)
 */
const StatisticsChart = ({ 
  model = 'total', 
  filter = 'month',
  title = 'Statistics',
  chartType = 'line'
}) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Generate sample data based on model and filter
  // In a real app, this would fetch from an API
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Generate different data based on model
        let generatedData = [];
        
        // Time periods based on filter
        const periods = {
          today: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
          week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          allTime: ['2018', '2019', '2020', '2021', '2022', '2023']
        };
        
        const timeLabels = periods[filter] || periods.month;
        
        // Generate data based on model
        switch (model) {
          case 'courses':
            generatedData = timeLabels.map((period, index) => ({
              name: period,
              enrollments: Math.floor(Math.random() * 500) + 100,
              completions: Math.floor(Math.random() * 300) + 50,
              value: Math.floor(Math.random() * 500) + 100
            }));
            break;
          case 'users':
            generatedData = timeLabels.map((period, index) => ({
              name: period,
              newUsers: Math.floor(Math.random() * 200) + 50,
              activeUsers: Math.floor(Math.random() * 800) + 200,
              value: Math.floor(Math.random() * 800) + 200
            }));
            break;
          case 'revenue':
            generatedData = timeLabels.map((period, index) => ({
              name: period,
              revenue: Math.floor(Math.random() * 10000) + 1000,
              expenses: Math.floor(Math.random() * 5000) + 500,
              value: Math.floor(Math.random() * 10000) + 1000
            }));
            break;
          case 'total':
          default:
            generatedData = timeLabels.map((period, index) => ({
              name: period,
              users: Math.floor(Math.random() * 1000) + 200,
              courses: Math.floor(Math.random() * 500) + 100,
              revenue: Math.floor(Math.random() * 8000) + 1000,
              value: Math.floor(Math.random() * 1000) + 200
            }));
        }
        
        setData(generatedData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        setIsLoading(false);
      }
    }, 1000);
  }, [model, filter]);
  
  // Determine chart colors based on model
  const getChartColors = () => {
    switch (model) {
      case 'courses':
        return {
          enrollments: theme.palette.primary.main,
          completions: theme.palette.success.main
        };
      case 'users':
        return {
          newUsers: theme.palette.info.main,
          activeUsers: theme.palette.primary.main
        };
      case 'revenue':
        return {
          revenue: theme.palette.success.main,
          expenses: theme.palette.error.main
        };
      case 'total':
      default:
        return {
          users: theme.palette.primary.main,
          courses: theme.palette.info.main,
          revenue: theme.palette.success.main
        };
    }
  };
  
  const colors = getChartColors();
  
  // Render appropriate chart based on chartType
  const renderChart = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress size={40} />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height={300}
          sx={{ 
            bgcolor: alpha(theme.palette.error.main, 0.1),
            borderRadius: 2,
            p: 3
          }}
        >
          <AlertCircle size={40} color={theme.palette.error.main} />
          <Typography variant="body1" color="error" mt={2}>
            {error}
          </Typography>
        </Box>
      );
    }
    
    // Determine which chart to render based on chartType and model
    switch (chartType) {
      case 'bar':
        return renderBarChart();
      case 'area':
        return renderAreaChart();
      case 'line':
      default:
        return renderLineChart();
    }
  };
  
  // Render line chart
  const renderLineChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {model === 'courses' && (
            <>
              <Line type="monotone" dataKey="enrollments" name="Enrollments" stroke={colors.enrollments} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="completions" name="Completions" stroke={colors.completions} />
            </>
          )}
          {model === 'users' && (
            <>
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke={colors.newUsers} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke={colors.activeUsers} />
            </>
          )}
          {model === 'revenue' && (
            <>
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke={colors.revenue} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke={colors.expenses} />
            </>
          )}
          {model === 'total' && (
            <>
              <Line type="monotone" dataKey="users" name="Users" stroke={colors.users} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="courses" name="Courses" stroke={colors.courses} />
              <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke={colors.revenue} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  // Render bar chart
  const renderBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {model === 'courses' && (
            <>
              <Bar dataKey="enrollments" name="Enrollments" fill={colors.enrollments} />
              <Bar dataKey="completions" name="Completions" fill={colors.completions} />
            </>
          )}
          {model === 'users' && (
            <>
              <Bar dataKey="newUsers" name="New Users" fill={colors.newUsers} />
              <Bar dataKey="activeUsers" name="Active Users" fill={colors.activeUsers} />
            </>
          )}
          {model === 'revenue' && (
            <>
              <Bar dataKey="revenue" name="Revenue" fill={colors.revenue} />
              <Bar dataKey="expenses" name="Expenses" fill={colors.expenses} />
            </>
          )}
          {model === 'total' && (
            <>
              <Bar dataKey="users" name="Users" fill={colors.users} />
              <Bar dataKey="courses" name="Courses" fill={colors.courses} />
              <Bar dataKey="revenue" name="Revenue ($)" fill={colors.revenue} />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  // Render area chart
  const renderAreaChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {model === 'courses' && (
            <>
              <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke={colors.enrollments} fill={alpha(colors.enrollments, 0.2)} />
              <Area type="monotone" dataKey="completions" name="Completions" stroke={colors.completions} fill={alpha(colors.completions, 0.2)} />
            </>
          )}
          {model === 'users' && (
            <>
              <Area type="monotone" dataKey="newUsers" name="New Users" stroke={colors.newUsers} fill={alpha(colors.newUsers, 0.2)} />
              <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke={colors.activeUsers} fill={alpha(colors.activeUsers, 0.2)} />
            </>
          )}
          {model === 'revenue' && (
            <>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={colors.revenue} fill={alpha(colors.revenue, 0.2)} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={colors.expenses} fill={alpha(colors.expenses, 0.2)} />
            </>
          )}
          {model === 'total' && (
            <>
              <Area type="monotone" dataKey="users" name="Users" stroke={colors.users} fill={alpha(colors.users, 0.2)} />
              <Area type="monotone" dataKey="courses" name="Courses" stroke={colors.courses} fill={alpha(colors.courses, 0.2)} />
              <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke={colors.revenue} fill={alpha(colors.revenue, 0.2)} />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {renderChart()}
    </Box>
  );
};

export default StatisticsChart;