// src/components/instructor/EditableCell.js
import React, { useState } from 'react';

const EditableCell = ({ value, onChange, onBlur }) => {
  const [editValue, setEditValue] = useState(value);

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    onChange(editValue);
    if (onBlur) onBlur();
  };

  return (
    <td>
      <input
        type="text"
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    </td>
  );
};

export default EditableCell;
