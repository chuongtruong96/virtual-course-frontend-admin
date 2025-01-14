import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

import menuItems  from '../../../menu-items';
import { BASE_TITLE } from '../../../config/constant';

const Breadcrumb = () => {
  const location = useLocation();

  const [main, setMain] = useState([]);
  const [item, setItem] = useState([]);

  useEffect(() => {
    menuItems.items.forEach((itemGroup, index) => {
      if (itemGroup.type === 'group') {
        getCollapse(itemGroup, index);
      }
    });
  }, [location.pathname]); // Thêm dependency vào useEffect
  
  const getCollapse = (itemGroup, index) => {
    if (itemGroup.children) {
      itemGroup.children.forEach((collapse) => {
        if (collapse.type === 'collapse') {
          getCollapse(collapse, index);
        } else if (collapse.type === 'item') {
          if (location.pathname === collapse.url) {
            setMain(itemGroup);
            setItem(collapse);
          }
        }
      });
    }
  };
  let mainContent, itemContent;
  let breadcrumbContent = '';
  let title = '';

  if (main && main.type === 'group') { // Sửa điều kiện để đúng với cấu trúc menuItems.js
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{main.title}</Link>
      </ListGroup.Item>
    );
  }

  if (item && item.type === 'item') {
    title = item.title;
    itemContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{title}</Link>
      </ListGroup.Item>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">{title}</h5>
                </div>
                <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
                  <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                    <Link to="/">
                      <i className="feather icon-home" />
                    </Link>
                  </ListGroup.Item>
                  {mainContent}
                  {itemContent}
                </ListGroup>
              </div>
            </div>
          </div>
        </div>
      );
    }

    document.title = title + BASE_TITLE;
  }

  return <React.Fragment>{breadcrumbContent}</React.Fragment>;
};

export default Breadcrumb;
