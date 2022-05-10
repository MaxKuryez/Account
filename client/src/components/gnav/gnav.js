import React from 'react';
import Search from './includes/search'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth_context';
import './gnav.scss';

function HomePage() {
  const { currentUser } = useAuth();

  return(
    <div className='gnav-container'>
      <Search />
      { currentUser ? <><Link to='/account/items' variant='link' className='sign-in' >Account</Link></> :
      <><Link to='/signin' variant='link' className='sign-in' >Sign In</Link></>}
    </div>
  );
}

export default HomePage;