import React from 'react';
import TableRow from './TableRow'; // Import the TableRow component

const TableBody = ({ data, columnsVisible, onEdit, onDelete }) => {
  return (
    <tbody>
      {data.map((account) => (
        <TableRow
          key={account.id} // Ensure each row has a unique key
          account={account}
          columnsVisible={columnsVisible}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
