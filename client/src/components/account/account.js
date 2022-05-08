import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth_context';
import Item from './includes/item';
import Address from './includes/address';
import './account.scss';

export default function Account( props ) {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    !currentUser && navigate('/signin');
  }, []);

  async function HandleLogout() {
    setError('');
    try {
      await logout();
      navigate('/signin');
    } catch {
      setError('Could not log out.');
    }
  }

  function renderAccountSection( section ) {
    switch(section) {
      case 'item':
        return (<><Item currentUser={currentUser}/></>);
      case 'address':
        return (<><Address currentUser={currentUser}/></>);
      default:
        return (<><Item currentUser={currentUser}/></>);
    }
  }

  return (
    <div className='account-container w-75 mx-auto'>
      <Card>
        <Card.Body>
          <h2 className='text-center'>Account</h2> 
          {error && <Alert variant='danger'>{error}</Alert>}
          <div className='row'>
            <div className='mt-1 col-sm-6 email-col'>Email: {currentUser && currentUser.email}</div>
            <div className='col-sm-6 log-out'>
              <Button variant='link' onClick={HandleLogout}>Log Out</Button>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6 links-col'>
              <Link to='/account/profile-preferences' className='btn btn-primary w-75 mt-5'>My Items</Link>
              <Link to='/account/address' className='btn btn-primary w-75 mt-2'>My Address</Link>
              <Link to='/account/rented-items' className='btn btn-primary w-75 mt-2'>Rented Items</Link>
            </div>
            <div className='col-sm-6 right-col mb-1'>
              {renderAccountSection(props.section)}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
