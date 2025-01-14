// src/components/WalletBadge.jsx
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Badge } from 'react-bootstrap';

const WalletBadge = React.memo(({ status }) => (
    <Badge
      bg={
        status === 'ACTIVE' ? 'success' :
        status === 'INACTIVE' ? 'danger' : 'secondary'
      }
      aria-label={`Wallet status: ${status}`}
    >
      {status}
    </Badge>
  ));
  
  WalletBadge.propTypes = {
    status: PropTypes.string.isRequired,
  };
  

export default WalletBadge;
