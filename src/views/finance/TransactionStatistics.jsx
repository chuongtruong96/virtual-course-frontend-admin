import React from 'react';
import FinanceDashboard from './FinanceDashboard';

const TransactionStatistics = () => {
  // This component just wraps the FinanceDashboard with the Transactions tab selected by default
  // The statistics are already shown in the TransactionDashboard component
  return <FinanceDashboard defaultTab={0} />;
};

export default TransactionStatistics;
