// src/components/Statistics/LineChart.jsx

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import ExportButton from './ExportButton';
import FilterComponent from './FilterComponent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChartComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Giả sử bạn có endpoint này để lấy xu hướng theo thời gian
        const response = await axios.get(`http://localhost:8080/api/statistics/trends?filter=${filter}`);
        console.log('LineChart Data:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching line chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <Typography variant="h6">Không có dữ liệu xu hướng.</Typography>;
  }

  const chartData = {
    labels: data.dates, // Ví dụ: ['Jan', 'Feb', 'Mar', ...]
    datasets: [
      {
        label: 'Accounts',
        data: data.accounts,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
      {
        label: 'Instructors',
        data: data.instructors,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      },
      // Thêm các dataset khác nếu cần
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Xu Hướng Thống Kê Theo Thời Gian',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `$${context.parsed.y}`;
            }
            return label;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Xu Hướng Thống Kê Theo Thời Gian
        </Typography>
        <FilterComponent filter={filter} setFilter={setFilter} />
        <Line data={chartData} options={options} id="lineChart" />
        <ExportButton chartId="lineChart" fileName="LineChart" />
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;
