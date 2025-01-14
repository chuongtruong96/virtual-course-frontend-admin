// src/views/account/CheckToken.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const CheckToken = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <h3>Check Token</h3>
      <p>Token from Auth Context: {auth.token}</p>
      <p>Token from localStorage: {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : 'No token found'}</p>
    </div>
  );
};

export default CheckToken;
