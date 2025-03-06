import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

const MonthlyTransactionChart = ({ data, isLoading, height = 300 }) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <Typography variant="body1" color="text.secondary">
          No transaction data available
        </Typography>
      </Box>
    );
  }

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" orientation="left" stroke={theme.palette.success.main} />
        <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
        <Tooltip 
          formatter={(value) => [formatCurrency(value), '']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="deposits"
          name="Deposits"
          stroke={theme.palette.success.main}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="withdrawals"
          name="Withdrawals"
          stroke={theme.palette.secondary.main}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTransactionChart;