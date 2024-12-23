import React from 'react';
import { Form } from 'react-bootstrap';

const ColumnVisibilityToggle = ({ columnsVisible = {}, toggleColumnVisibility }) => {  // Cung cấp giá trị mặc định cho columnsVisible
  return (
    <div className="column-visibility-toggle">
      {Object.keys(columnsVisible).map((column) => (
        <Form.Check
          key={column}
          type="checkbox"
          id={`toggle-${column}`}
          label={column.charAt(0).toUpperCase() + column.slice(1)}
          checked={columnsVisible[column]}
          onChange={() => toggleColumnVisibility(column)}
        />
      ))}
    </div>
  );
};

export default ColumnVisibilityToggle;
