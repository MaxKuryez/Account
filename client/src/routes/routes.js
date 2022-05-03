import React, {useEffect} from 'react';
import Login from '../components/signup/signup';
import { AuthProvider } from '../contexts/auth_context';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Account from '../components/account/account';
import SignIn from '../components/signin/signin';
import Home from '../components/homepage/homepage';
import SearchPage from '../components/search_page/search_page'

function Routing() {

return (
    <div className='routes'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<LoginPage />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/address' element={<AddressPage />} />
            <Route path='/rented-items' element={<RentPage />} />
            <Route path='/profile-preferences' element={<ProfilePage />} />
            <Route path='/search' element={<SearchPageElement />} />
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

function HomePage() {
  return (
    <div>
      <Home/>
    </div>
  );
}

function SearchPageElement() {
  return (
    <div>
      <SearchPage/>
    </div>
  );
}

export default Routing;
