import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

const TransactionTypePieChart = ({ data, isLoading, height = 300 }) => {
  const theme = useTheme();

  // Default colors for pie chart segments
  const COLORS = [theme.palette.success.main, theme.palette.secondary.main];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for the chart
  const chartData = [
    { name: 'Deposits', value: data?.totalDeposits || 0 },
    { name: 'Withdrawals', value: data?.totalWithdrawals || 0 }
  ];

  // If no data, show a message
  if (!data || (chartData[0].value === 0 && chartData[1].value === 0)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <Typography variant="body1" color="text.secondary">
          No transaction data available
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TransactionTypePieChart;