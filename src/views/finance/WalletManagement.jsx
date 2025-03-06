import React from 'react';
import WalletDashboard from '../wallet/WalletDashboard';

const WalletManagement = () => {
  // This component just wraps the FinanceDashboard with the Wallets tab selected by default
  return <WalletDashboard defaultTab={1} />;
};

export default WalletManagement;