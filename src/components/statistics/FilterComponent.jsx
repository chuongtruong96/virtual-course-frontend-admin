// src/components/Statistics/FilterComponent.jsx

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FilterComponent = ({ filter, setFilter }) => {
  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="filter-label">Khoảng Thời Gian</InputLabel>
      <Select
        labelId="filter-label"
        id="filter-select"
        value={filter}
        label="Khoảng Thời Gian"
        onChange={handleChange}
      >
        <MenuItem value="today">Today</MenuItem>
        <MenuItem value="week">This Week</MenuItem>
        <MenuItem value="month">This Month</MenuItem>
        <MenuItem value="year">This Year</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FilterComponent;
