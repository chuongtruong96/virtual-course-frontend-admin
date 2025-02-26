import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import useAdminDashboard from '../../hooks/useAdminDashboard';
import ExportButton from './ExportButton';
import { COLORS, CHART_OPTIONS, MODEL_COLORS } from './Constants';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler
);

const StatisticsChart = ({ model, filter, title }) => {
  const [chartType, setChartType] = useState('bar');
  const { statistics, trends, isLoading, isError, error } = useAdminDashboard(filter, model);
  const [trend, setTrend] = useState({ value: 0, isPositive: true });
  const chartRef = useRef(null);

  useEffect(() => {
    calculateTrend();
  }, [trends]);

  const calculateTrend = () => {
    if (!trends || !trends[model]) return;
    
    const data = trends[model];
    if (data.length < 2) return;

    const lastValue = data[data.length - 1];
    const previousValue = data[data.length - 2];
    
    if (lastValue === 0 && previousValue === 0) {
      setTrend({ value: 0, isPositive: true });
      return;
    }

    const trendValue = ((lastValue - previousValue) / previousValue) * 100;
    setTrend({
      value: Math.abs(trendValue),
      isPositive: trendValue >= 0
    });
  };

  const getModelColor = () => {
    return MODEL_COLORS[model] || {
      primary: 'rgba(75, 192, 192, 0.6)',
      border: 'rgba(75, 192, 192, 1)',
      gradient: ['rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.2)']
    };
  };

  const getModelIcon = () => {
    return MODEL_COLORS[model]?.icon || '📊';
  };

  const getDatesForFilter = (filter) => {
    const today = new Date();
    let labels = [];

    switch (filter) {
      case 'today':
        for (let i = 0; i <= today.getHours(); i++) {
          let date = new Date(today.setHours(i, 0, 0, 0));
          labels.push(date.toLocaleString('en-US', { hour: 'numeric', hour12: true }));
        }
        break;
      case 'week':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        for (let i = 0; i < 7; i++) {
          let date = new Date(startOfWeek);
          date.setDate(date.getDate() + i);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        break;
      case 'month':
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          labels.push(`${i}`);
        }
        break;
      case 'year':
        for (let i = 0; i < 12; i++) {
          labels.push(new Date(0, i).toLocaleString('en-US', { month: 'short' }));
        }
        break;
      default:
        labels = ['All Time'];
    }
    return labels;
  };

  const prepareChartData = () => {
    if (!statistics) return null;

    let labels, data;
    const modelColor = getModelColor();

    if (model === "total") {
      labels = ["Accounts", "Instructors", "Students", "Courses", "Categories"];
      data = [
        statistics.totalAccounts || 0,
        statistics.instructors?.total || 0,
        statistics.students?.total || 0,
        statistics.courses?.total || 0,
        statistics.categories?.total || 0
      ];
    } else {
      labels = getDatesForFilter(filter);
      data = trends?.[model] || [statistics[model]?.total || 0];
      
      if (data.length < labels.length) {
        data = data.concat(Array(labels.length - data.length).fill(0));
      }
    }

    return {
      labels,
      datasets: [{
        label: title || 'Statistics Overview',
        data,
        backgroundColor: chartType === 'pie' ? COLORS : 
                        chartType === 'line' ? 'transparent' : 
                        model === 'total' ? COLORS : modelColor.primary,
        borderColor: chartType === 'line' ? modelColor.border : undefined,
        borderWidth: 1,
        fill: chartType === 'line' ? {
          target: 'origin',
          above: modelColor.gradient[0]
        } : true,
        tension: 0.4,
        pointRadius: chartType === 'line' ? 4 : 0,
        pointHoverRadius: chartType === 'line' ? 6 : 0,
        pointBackgroundColor: modelColor.border
      }]
    };
  };

  const chartData = prepareChartData();
  const options = {
    ...CHART_OPTIONS,
    plugins: {
      ...CHART_OPTIONS.plugins,
      title: {
        ...CHART_OPTIONS.plugins.title,
        text: title || 'Statistics Overview'
      }
    }
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      );
    }

    if (isError || !chartData) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <Typography color="error">
            {error?.message || 'No data available'}
          </Typography>
        </Box>
      );
    }

    const ChartComponent = {
      bar: Bar,
      line: Line,
      pie: Pie
    }[chartType];

    return (
      <Box height={300}>
        <ChartComponent
          ref={chartRef}
          data={chartData}
          options={options}
        />
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="span">
              {getModelIcon()} {title || 'Statistics Overview'}
            </Typography>
            {trend.value > 0 && (
              <Chip
                icon={trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                label={`${trend.value.toFixed(1)}%`}
                color={trend.isPositive ? "success" : "error"}
                size="small"
              />
            )}
          </Box>
          <Tooltip title="Refresh data">
            <IconButton size="small">
              <RefreshCw size={16} />
            </IconButton>
          </Tooltip>
        </Box>
        
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            label="Chart Type"
          >
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="line">Line Chart</MenuItem>
            <MenuItem value="pie">Pie Chart</MenuItem>
          </Select>
        </FormControl>
        
        {renderChart()}
        
        <Box mt={2} display="flex" justifyContent="flex-end">
          <ExportButton chartId={chartType} fileName={title?.replace(/\s+/g, '_') || 'statistics'} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsChart;