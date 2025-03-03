// src/components/instructor/TabPanel.jsx
import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const TabPanel = React.memo(({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`instructor-tabpanel-${index}`}
    aria-labelledby={`instructor-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
));

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default TabPanel;