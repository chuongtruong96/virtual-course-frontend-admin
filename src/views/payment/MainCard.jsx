import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import './MainCard.css'; // Import the CSS file

/**
 * MainCard component - A wrapper component for consistent card styling across the application
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.secondary - Secondary content to display in the header (e.g., buttons)
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes for the card
 * @param {string} props.headerClass - Additional CSS classes for the card header
 * @param {string} props.contentClass - Additional CSS classes for the card content
 * @param {string} props.footerClass - Additional CSS classes for the card footer
 * @param {React.ReactNode} props.footer - Footer content
 * @param {boolean} props.border - Whether to show card border
 * @param {boolean} props.boxShadow - Whether to show card box shadow
 * @param {boolean} props.shadow - Alternative shadow style
 * @param {Object} props.sx - Additional inline styles for the card
 */
const MainCard = ({
  title,
  secondary,
  children,
  className = '',
  headerClass = '',
  contentClass = '',
  footerClass = '',
  footer = null,
  border = true,
  boxShadow = true,
  shadow = false,
  sx = {},
  ...rest
}) => {
  // Prepare card styling classes
  const cardClasses = [
    className,
    {
      'border-0': !border,
      'box-shadow-0': !boxShadow,
      'card-shadow': shadow
    }
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card className={cardClasses} style={sx} {...rest}>
      {/* Card Header - Only rendered if title or secondary content exists */}
      {(title || secondary) && (
        <Card.Header className={`${headerClass} border-bottom`}>
          {title && <Card.Title as="h5">{title}</Card.Title>}
          {secondary && <div className="card-header-right">{secondary}</div>}
        </Card.Header>
      )}

      {/* Card Body - Always rendered */}
      <Card.Body className={contentClass}>
        {children}
      </Card.Body>

      {/* Card Footer - Only rendered if footer content exists */}
      {footer && (
        <Card.Footer className={`${footerClass} border-top`}>
          {footer}
        </Card.Footer>
      )}
    </Card>
  );
};

MainCard.propTypes = {
  title: PropTypes.string,
  secondary: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  headerClass: PropTypes.string,
  contentClass: PropTypes.string,
  footerClass: PropTypes.string,
  footer: PropTypes.node,
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  shadow: PropTypes.bool,
  sx: PropTypes.object
};

export default MainCard;