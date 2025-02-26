// src/layouts/AdminLayout/NavBar/NavLeft/index.jsx
import React from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';

// Import your custom toggle
import CustomToggle from '../../../../components/CustomToggle';

const NavLeft = () => {
  const windowSize = useWindowSize();
  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass.push('d-none');
  }

  return (
    <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
      <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
        <Dropdown align="start">
          <Dropdown.Toggle
            as={CustomToggle}
            variant="link"
            id="dropdown-left"
          >
            Dropdown
          </Dropdown.Toggle>
          <ul>
            <Dropdown.Menu>
              <li>
                <Link to="#" className="dropdown-item">Action</Link>
              </li>
              <li>
                <Link to="#" className="dropdown-item">Another action</Link>
              </li>
              <li>
                <Link to="#" className="dropdown-item">Something else here</Link>
              </li>
            </Dropdown.Menu>
          </ul>
        </Dropdown>
      </ListGroup.Item>
      <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
        <NavSearch windowWidth={windowSize.width} />
      </ListGroup.Item>
    </ListGroup>
  );
};

export default NavLeft;
