// src/components/CustomToggle.jsx
import React from 'react';

// A forwardRef component to use as a custom Dropdown toggle.
// This example includes a small Feather arrow icon to the right of your children.
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="#!"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{
      color: 'inherit',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
    }}
  >
    {children}
    {/* The arrow icon. Feather will replace <i data-feather="chevron-down"> with an SVG. */}
    <i data-feather="chevron-down" style={{ marginLeft: '4px' }}></i>
  </a>
));

export default CustomToggle;
