import React from 'react';
import { Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const WalletStatisticsChart = ({ data }) => {
  const theme = useTheme();

  // Prepare data for wallet status pie chart
  const walletStatusData = [
    { name: 'Active', value: data.activeWallets, color: theme.palette.success.main },
    { name: 'Suspended', value: data.suspendedWallets, color: theme.palette.warning.main },
    { name: 'Closed', value: data.closedWallets, color: theme.palette.error.main }
  ];

  // Filter out zero values
  const filteredWalletStatusData = walletStatusData.filter(item => item.value > 0);

  // Prepare data for balance distribution bar chart
  // This is a simplified example - in a real app, you might want to fetch more detailed data
  const balanceDistributionData = [
    { name: 'Total Balance', value: data.totalBalance },
    { name: 'Average Balance', value: data.averageBalance }
  ];

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Wallet Status Pie Chart */}
      <Box sx={{ width: { xs: '100%', md: '50%' }, height: { xs: 300, md: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
  <Pie
    data={filteredWalletStatusData}
    cx="50%"
    cy="50%"
    labelLine={false}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
  >
    {filteredWalletStatusData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip formatter={(value) => [value, 'Wallets']} />
  <Legend />
</PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Balance Distribution Bar Chart */}
      <Box sx={{ width: { xs: '100%', md: '50%' }, height: { xs: 300, md: 400 } }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={balanceDistributionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
            <Legend />
            <Bar dataKey="value" name="Balance" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default WalletStatisticsChart;