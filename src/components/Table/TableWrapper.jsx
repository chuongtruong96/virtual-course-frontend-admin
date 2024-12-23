import React from 'react';
import Table from './Table';  // Component bảng chính

const TableWrapper = ({ accounts }) => {
  if (!accounts || accounts.length === 0) {
    return <p>No accounts available</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          {/* Add other headers as needed */}
        </tr>
      </thead>
      <tbody>
        {accounts.map(account => (
          <tr key={account.id}>
            <td>{account.username}</td>
            <td>{account.email}</td>
            {/* Render other account details */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default TableWrapper;
