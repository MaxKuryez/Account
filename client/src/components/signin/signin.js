import React, { useRef, useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth_context';
import './signin.scss';

function Account() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signin, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    currentUser && navigate('/account');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await signin(emailRef.current.value, passwordRef.current.value);
      navigate('/account');
    } catch (error) {
      error ? setError(error.message.replace(/Firebase: /,'')) : setError('Could not sign in.');
    }

    setLoading(false);
  }

  return (
    <div className='login-container w-75 mx-auto'>
      <Card>
        <Card.Body>
          <h2 className='text-center'>Log In</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mt-3' id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' ref={emailRef} required/>
            </Form.Group>
            <Form.Group className='mt-3' id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} required/>
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-4' type='submit'>Log In</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-4'>
        Don't have an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </div>
  );
}

export default Account;
