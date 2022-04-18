import React from 'react';
import Login from '../components/login/login';
import { AuthProvider } from '../contexts/auth_context';

function Routes() {

  return (
    <div className='routes'>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </div>
  );
}

export default Routes;
