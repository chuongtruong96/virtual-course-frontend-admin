// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Widgets,
  Build,
  List as ListIcon,
  AddCircle,
  Group,
  School,
  Category,
  Book,
  Person,
  Security,
  BarChart,
  PieChart,
  Map,
  Lock,
  Pageview,
  Menu as MenuIcon,
  Block,
  PersonAdd,
} from '@mui/icons-material';

import { Link } from 'react-router-dom';
import menuItems from '../../menuItems';

const iconMapping = {
  Dashboard: <Dashboard />,
  Widgets: <Widgets />,
  Build: <Build />,
  List: <ListIcon />,
  AddCircle: <AddCircle />,
  Group: <Group />,
  School: <School />,
  Category: <Category />,
  Book: <Book />,
  Person: <Person />,
  Security: <Security />,
  BarChart: <BarChart />,
  PieChart: <PieChart />,
  Map: <Map />,
  Lock: <Lock />,
  Pageview: <Pageview />,
  Menu: <MenuIcon />,
  Block: <Block />,
  PersonAdd: <PersonAdd />,
};

const Sidebar = () => {
  const [openMenus, setOpenMenus] = React.useState({});

  const handleClick = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderMenuItems = (items) =>
    items.map((item) => {
      if (item.type === 'group') {
        return (
          <React.Fragment key={item.id}>
            <ListItem>
              <ListItemIcon>{iconMapping[item.icon] || <MenuIcon />}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
            {item.children && renderMenuItems(item.children)}
          </React.Fragment>
        );
      }

      if (item.type === 'collapse') {
        return (
          <React.Fragment key={item.id}>
            <ListItem button onClick={() => handleClick(item.id)}>
              <ListItemIcon>{iconMapping[item.icon] || <MenuIcon />}</ListItemIcon>
              <ListItemText primary={item.title} />
              {openMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children && renderMenuItems(item.children)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      return (
        <ListItem button key={item.id} component={Link} to={item.url} disabled={item.disabled}>
          <ListItemIcon>{iconMapping[item.icon] || <MenuIcon />}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      );
    });

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {renderMenuItems(menuItems.items)}
      </List>
    </Drawer>
  );
};

export default Sidebar;
