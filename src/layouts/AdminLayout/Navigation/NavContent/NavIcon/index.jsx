// src/layouts/AdminLayout/NavBar/NavIcon.jsx
import React from 'react';
import PropTypes from 'prop-types';

const NavIcon = ({ items }) => {
  return (
    <span className="pcoded-micon">
      <i data-feather={items.icon} style={{ color: 'red' }}></i>
    </span>
  );
};

NavIcon.propTypes = {
  items: PropTypes.object.isRequired,
};

export default NavIcon;
