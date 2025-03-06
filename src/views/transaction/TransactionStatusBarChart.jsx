import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

const TransactionStatusBarChart = ({ data, isLoading, height = 300 }) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for the chart
  const chartData = [
    { name: 'Pending', value: data?.pendingTransactions || 0, color: theme.palette.warning.main },
    { name: 'Completed', value: data?.completedTransactions || 0, color: theme.palette.success.main },
    { name: 'Failed', value: data?.failedTransactions || 0, color: theme.palette.error.main }
  ];

  // If no data, show a message
  if (!data || chartData.every(item => item.value === 0)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <Typography variant="body1" color="text.secondary">
          No transaction status data available
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
        <Bar dataKey="value" name="Transactions">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TransactionStatusBarChart;