import React from 'react';

const TableRow = ({ account }) => {
  const { username, email, authenticationType, enable } = account;

  return (
    <tr>
      <td>{username}</td>
      <td>{email}</td>
      <td>{authenticationType}</td>
      <td>{enable ? 'Active' : 'Inactive'}</td>
      <td>
        <button onClick={() => handleEdit(account)}>Edit</button>
        <button onClick={() => handleDelete(account.id)}>Delete</button>
      </td>
    </tr>
  );
};

const handleEdit = (account) => {
  console.log("Edit account", account);
};

const handleDelete = (accountId) => {
  console.log("Delete account", accountId);
};

export default TableRow;
