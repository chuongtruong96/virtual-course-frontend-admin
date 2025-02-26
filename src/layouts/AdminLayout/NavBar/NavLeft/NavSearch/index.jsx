// src/layouts/AdminLayout/NavBar/NavLeft/NavSearch.jsx
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavSearch = ({ windowWidth }) => {
  const [isOpen, setIsOpen] = useState(windowWidth < 600);
  const [searchString, setSearchString] = useState(windowWidth < 600 ? '100px' : '');

  const searchOnHandler = () => {
    if (windowWidth < 600) {
      document.querySelector('#navbar-right')?.classList.add('d-none');
    }
    setIsOpen(true);
    setSearchString('100px');
  };

  const searchOffHandler = () => {
    setIsOpen(false);
    setSearchString(0);
    setTimeout(() => {
      if (windowWidth < 600) {
        document.querySelector('#navbar-right')?.classList.remove('d-none');
      }
    }, 500);
  };

  const searchClass = ['main-search', isOpen ? 'open' : ''].filter(Boolean).join(' ');

  return (
    <div id="main-search" className={searchClass}>
      <div className="input-group">
        <input
          type="text"
          id="m-search"
          className="form-control"
          placeholder="Search . . ."
          style={{ width: searchString }}
        />
        <Link to="#" className="input-group-append search-close" onClick={searchOffHandler}>
          <i data-feather="x" className="input-group-text" style={{ cursor: 'pointer' }}></i>
        </Link>
        <span
          onKeyDown={searchOnHandler}
          role="button"
          tabIndex="0"
          className="input-group-append search-btn btn btn-primary"
          onClick={searchOnHandler}
          style={{ borderRadius: '50%', marginLeft: 5 }}
        >
          <i data-feather="search" className="input-group-text" style={{ cursor: 'pointer' }}></i>
        </span>
      </div>
    </div>
  );
};

NavSearch.propTypes = {
  windowWidth: PropTypes.number,
};

export default NavSearch;
