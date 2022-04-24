import React from 'react';
import { Link } from 'react-router-dom';
import { FormControl, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/auth_context';
import './homepage.scss';

function HomePage() {
  const { currentUser } = useAuth();

  return(
    <div className='gnav-container'>
      <Form className="d-flex search-form">
        <FormControl
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button>Search</Button>
      </Form>
      { currentUser ? <><Link to='/account' variant='link' className='sign-in' >Account</Link></> :
      <><Link to='/signin' variant='link' className='sign-in' >Sign In</Link></>}
    </div>
  );
}

export default HomePage;