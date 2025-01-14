// src/components/AccessibleButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

const AccessibleButton = ({ onClick, label, children }) => (
  <button onClick={onClick} aria-label={label}>
    {children}
  </button>
);

AccessibleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AccessibleButton;
