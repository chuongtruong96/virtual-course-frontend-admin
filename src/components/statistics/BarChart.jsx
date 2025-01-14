// src/components/Statistics/BarChart.jsx

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import ExportButton from './ExportButton';
import FilterComponent from './FilterComponent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const BarChartComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // Retrieve JWT token from storage
        const response = await axios.get(`http://localhost:8080/api/statistics?filter=${filter}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in headers
          },
        });
        console.log('BarChart Data:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
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
    return <Typography variant="h6">Không có dữ liệu thống kê.</Typography>;
  }

  const chartData = {
    labels: ['Accounts', 'Instructors', 'Students', 'Courses', 'Categories', 'Roles'],
    datasets: [
      {
        label: 'Số lượng',
        data: [data.accounts, data.instructors, data.students, data.courses, data.categories, data.roles],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true,
      },
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
        text: 'Thống Kê Tổng Quan',
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
          Thống Kê Tổng Quan
        </Typography>
        <FilterComponent filter={filter} setFilter={setFilter} />
        <Bar data={chartData} options={options} id="barChart" />
        <ExportButton chartId="barChart" fileName="BarChart" />
      </CardContent>
    </Card>
  );
};

export default BarChartComponent;
