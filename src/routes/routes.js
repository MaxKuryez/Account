import React from 'react';
import Login from '../components/login/login';
import { AuthProvider } from '../contexts/auth_context';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Account from '../components/account/account';
import SignIn from '../components/signin/signin';

function Routing() {

return (
    <div className='routes'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/signup' element={<LoginPage />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/address' element={<AddressPage />} />
            <Route path='/rented-items' element={<RentPage />} />
            <Route path='/profile-preferences' element={<ProfilePage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

function LoginPage() {
  return (
    <div>
      <Login/>
    </div>
  );
}

function SignInPage() {
  return (
    <div>
      <SignIn/>
    </div>
  );
}

function AccountPage() {
  return (
    <div>
      <Account/>
    </div>
  );
}

function AddressPage() {
  return (
    <div>
      <Account/>
    </div>
  );
}

function RentPage() {
  return (
    <div>
      <Account/>
    </div>
  );
}

function ProfilePage() {
  return (
    <div>
      <Account/>
    </div>
  );
}

export default Routing;
