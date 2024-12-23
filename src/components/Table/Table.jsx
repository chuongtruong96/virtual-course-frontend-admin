import React from 'react';
import TableHeader from './TableHeader';  // Component tiêu đề bảng
import TableRow from './TableRow';        // Component hiển thị từng hàng

const Table = ({ columns, data }) => (
  <table>
    <TableHeader columns={columns} />
    <tbody>
      {data.map((account) => (
        <TableRow key={account.id} account={account} />
      ))}
    </tbody>
  </table>
);

export default Table;
