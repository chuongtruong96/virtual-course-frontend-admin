import React from 'react';
import { Box, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const TransactionStatisticsChart = ({ data }) => {
  const theme = useTheme();

  // Prepare data for transaction type bar chart
  const transactionTypeData = [
    {
      name: 'Deposits',
      count: data.totalDeposits,
      amount: data.totalDepositAmount,
    },
    {
      name: 'Withdrawals',
      count: data.totalWithdrawals,
      amount: data.totalWithdrawalAmount,
    }
  ];

  // Prepare data for transaction status pie chart
  const transactionStatusData = [
    { name: 'Pending', value: data.pendingTransactions, color: theme.palette.warning.main },
    { name: 'Completed', value: data.completedTransactions, color: theme.palette.success.main },
    { name: 'Failed', value: data.failedTransactions, color: theme.palette.error.main }
  ];

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Transaction Type Bar Chart */}
      <Box sx={{ width: { xs: '100%', md: '50%' }, height: { xs: 300, md: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transactionTypeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
            <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'amount') return [formatCurrency(value), 'Amount'];
                return [value, 'Count'];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="Number of Transactions" fill={theme.palette.primary.main} />
            <Bar yAxisId="right" dataKey="amount" name="Total Amount" fill={theme.palette.secondary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Transaction Status Pie Chart */}
      <Box sx={{ width: { xs: '100%', md: '50%' }, height: { xs: 300, md: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={transactionStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {transactionStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Transactions']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default TransactionStatisticsChart;