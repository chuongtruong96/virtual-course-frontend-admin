// src/views/wallet/__tests__/WalletForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WalletForm from '../WalletForm';
import { NotificationContext } from '../../../contexts/NotificationContext';
import { BrowserRouter as Router } from 'react-router-dom';

describe('WalletForm Component', () => {
  const mockAddNotification = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    render(
      <NotificationContext.Provider value={{ addNotification: mockAddNotification }}>
        <Router>
          <WalletForm />
        </Router>
      </NotificationContext.Provider>
    );
  });

  it('renders the form correctly', () => {
    expect(screen.getByLabelText(/Balance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Limit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Wallet/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Add Wallet/i }));
    expect(await screen.findAllByText(/is required/i)).toHaveLength(2); // Balance and Status
  });

  it('submits the form with valid data', async () => {
    fireEvent.change(screen.getByLabelText(/Balance/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'ACTIVE' } });
    fireEvent.change(screen.getByLabelText(/Max Limit/i), { target: { value: '500' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Wallet/i }));

    // Assuming addWallet is mocked to resolve
    // Wait for navigation or notification
    // Add appropriate assertions based on your testing setup
  });
});
