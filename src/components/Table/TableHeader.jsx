import React from 'react';

const TableHeader = ({ columns }) => (
  <thead>
    <tr>
      {columns.map((column, index) => (
        <th key={index}>{column}</th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
