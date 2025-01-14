// src/components/WalletCardSkeleton.jsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card } from 'react-bootstrap';

const WalletCardSkeleton = () => (
  <Card className="mb-3">
    <Card.Header>
      <Skeleton height={30} width={`50%`} />
    </Card.Header>
    <Card.Body>
      <Skeleton height={20} width={`80%`} />
      <Skeleton height={20} width={`60%`} className="mt-2" />
      <Skeleton height={20} width={`40%`} className="mt-2" />
    </Card.Body>
    <Card.Footer>
      <Skeleton height={30} width={`30%`} />
      <Skeleton height={30} width={`30%`} className="ms-2" />
    </Card.Footer>
  </Card>
);

export default WalletCardSkeleton;
