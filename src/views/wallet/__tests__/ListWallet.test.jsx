// src/views/wallet/__tests__/ListWallet.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ListWallet from '../ListWallet';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { BrowserRouter as Router } from 'react-router-dom';
import * as walletService from '../../services/walletService';

jest.mock('../../services/walletService');

describe('ListWallet Component', () => {
  const mockAddNotification = jest.fn();

  beforeEach(() => {
    walletService.fetchWallets.mockResolvedValue([
      { id: 1, balance: 1000, statusWallet: 'ACTIVE', maxLimit: 5000 },
      { id: 2, balance: 500, statusWallet: 'INACTIVE', maxLimit: null },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders wallets after loading', async () => {
    render(
      <NotificationContext.Provider value={{ addNotification: mockAddNotification }}>
        <Router>
          <ListWallet />
        </Router>
      </NotificationContext.Provider>
    );

    expect(screen.getByLabelText(/Loading Wallets/i)).toBeInTheDocument();

    await waitFor(() => expect(walletService.fetchWallets).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/Wallet List/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1000.00')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('5000.00')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('500.00')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('handles delete wallet', async () => {
    walletService.deleteWallet.mockResolvedValue();

    render(
      <NotificationContext.Provider value={{ addNotification: mockAddNotification }}>
        <Router>
          <ListWallet />
        </Router>
      </NotificationContext.Provider>
    );

    await waitFor(() => expect(walletService.fetchWallets).toHaveBeenCalledTimes(1));

    const deleteButtons = screen.getAllByRole('button', { name: /Delete Wallet/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText(/Delete Wallet/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete Wallet ID 1\?/i)).toBeInTheDocument();

    const confirmDeleteButton = screen.getByRole('button', { name: /Confirm Delete Wallet/i });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => expect(walletService.deleteWallet).toHaveBeenCalledWith(1));
    expect(mockAddNotification).toHaveBeenCalledWith('Wallet deleted successfully.', 'success');
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});
