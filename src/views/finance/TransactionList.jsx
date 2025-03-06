import React from 'react';
import FinanceDashboard from './FinanceDashboard';

const TransactionList = () => {
  // This component just wraps the FinanceDashboard with the Transactions tab selected by default
  return <FinanceDashboard defaultTab={0} />;
};

export default TransactionList;
