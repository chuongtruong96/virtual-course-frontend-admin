// src/components/instructor/GroupingWrapper.js
import React from 'react';
import { Select, MenuItem } from '@mui/material';

const GroupingWrapper = ({ groupBy, setGroupBy }) => {
  return (
    <div>
      <label>Group by:</label>
      <Select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value)}
        variant="outlined"
        size="small"
      >
        <MenuItem value="role">Role</MenuItem>
        <MenuItem value="status">Status</MenuItem>
      </Select>
    </div>
  );
};

export default GroupingWrapper;
