import React, { useState } from 'react';
import { Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import StatisticsChart from './StatisticsChart';

const StatisticsPage = () => {
  const [filters, setFilters] = useState({
    accounts: 'allTime',
    instructors: 'allTime',
    students: 'allTime',
    courses: 'allTime',
    categories: 'allTime',
    total: 'allTime'
  });

  const handleFilterChange = (model, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [model]: value
    }));
  };

  return (
    <Grid container spacing={2}>
      {/* Total Overview */}
      <Grid item xs={12}>
        <StatisticsChart model="total" filter={filters.total} title="Overall Statistics" />
      </Grid>

      {/* Individual Charts */}
      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={filters.accounts}
            onChange={(e) => handleFilterChange('accounts', e.target.value)}
            label="Time Range"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="allTime">All Time</MenuItem>
          </Select>
        </FormControl>
        <StatisticsChart model="accounts" filter={filters.accounts} title="Account Growth" />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={filters.courses}
            onChange={(e) => handleFilterChange('courses', e.target.value)}
            label="Time Range"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="allTime">All Time</MenuItem>
          </Select>
        </FormControl>
        <StatisticsChart model="courses" filter={filters.courses} title="Course Growth" />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={filters.instructors}
            onChange={(e) => handleFilterChange('instructors', e.target.value)}
            label="Time Range"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="allTime">All Time</MenuItem>
          </Select>
        </FormControl>
        <StatisticsChart model="instructors" filter={filters.instructors} title="Instructor Growth" />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={filters.students}
            onChange={(e) => handleFilterChange('students', e.target.value)}
            label="Time Range"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
            <MenuItem value="allTime">All Time</MenuItem>
          </Select>
        </FormControl>
        <StatisticsChart model="students" filter={filters.students} title="Student Growth" />
      </Grid>
    </Grid>
  );
};

export default StatisticsPage;