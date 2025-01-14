// src/components/Statistics/PieChart.jsx

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import ExportButton from './ExportButton';
import FilterComponent from './FilterComponent';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const PieChartComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/statistics?filter=${filter}`);
        console.log('PieChart Data:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
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
        label: '# of Votes',
        data: [data.accounts, data.instructors, data.students, data.courses, data.categories, data.roles],
        backgroundColor: COLORS,
        hoverOffset: 4
      }
    ]
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tỉ Lệ Thực Thể
        </Typography>
        <FilterComponent filter={filter} setFilter={setFilter} />
        <Pie data={chartData} id="pieChart" />
        <ExportButton chartId="pieChart" fileName="PieChart" />
      </CardContent>
    </Card>
  );
};

export default PieChartComponent;
