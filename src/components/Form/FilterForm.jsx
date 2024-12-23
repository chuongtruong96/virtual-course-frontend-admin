import React from 'react';

const FilterForm = ({ filters, onFilterChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={filters.username}
        onChange={(e) => onFilterChange({ username: e.target.value })}
      />
      <input
        type="text"
        placeholder="Email"
        value={filters.email}
        onChange={(e) => onFilterChange({ email: e.target.value })}
      />
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>
  );
};

export default FilterForm;
