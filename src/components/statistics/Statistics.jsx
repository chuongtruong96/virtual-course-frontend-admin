// src/components/Statistics/Statistics.jsx

import React from 'react';
import { Grid2 } from '@mui/material';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';
import LineChartComponent from './LineChart';

const Statistics = () => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 item xs={12} md={6}>
        <BarChartComponent />
      </Grid2>
      <Grid2 item xs={12} md={6}>
        <PieChartComponent />
      </Grid2>
      <Grid2 item xs={12} md={12}>
        <LineChartComponent />
      </Grid2>
    </Grid2>
  );
};

export default Statistics;
