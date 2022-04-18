import React, {useState} from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth_context';
import Item from './item';
import './account.scss';

export default function Account() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function HandleLogout() {
    setError('');
    try {
      await logout();
      navigate('/signin');
    } catch {
      setError('Could not log out.');
    }
  }

  return (
    <div className='account-container w-75 mx-auto'>
      <Card>
        <Card.Body className='row'>
          <h2 className='text-center'>Account</h2>
            <div className='col-sm-6'>
              {error && <Alert variant='danger'>{error}</Alert>}
                <div className='mt-1'>Email: {currentUser.email}</div>
              <Link to='/profile-preferences' className='btn btn-primary w-75 mt-5'>Profile Preferences</Link>
              <Link to='/address' className='btn btn-primary w-75 mt-2'>My Address</Link>
              <Link to='/rented-items' className='btn btn-primary w-75 mt-2'>Rented Items</Link>
            </div>
            <div className='col-sm-6 right-col'>
              <Button className='col-sm-6' variant='link' onClick={HandleLogout}>Log Out</Button>
              <Item />
            </div>
        </Card.Body>
      </Card>
    </div>
  );
}
