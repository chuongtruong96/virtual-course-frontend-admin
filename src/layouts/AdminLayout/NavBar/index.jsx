// src/layouts/AdminLayout/NavBar/index.jsx
import React, { useEffect } from 'react';
import NavLeft from './NavLeft';
import NavRight from './NavRight';

const NavBar = () => {
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <nav className="pcoded-header">
      <div className="navbar-wrapper d-flex justify-content-between align-items-center">
        <div className="navbar-left">
          <NavLeft />
        </div>
        <div className="navbar-right">
          <NavRight />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
