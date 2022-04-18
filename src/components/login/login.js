import React, { useRef, useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/auth_context';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser, createUserDocument } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    currentUser && navigate('/account');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError ('Please provide the password confirmation.');
    }

    try {
      setError('');
      setLoading(true);

      let user = await signup(emailRef.current.value, passwordRef.current.value);

      createUserDocument(user);
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
          <h2 className='text-center'>Sign Up</h2>
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
            <Form.Group className='mt-3' id='password-confirm'>
              <Form.Label>Confirm password</Form.Label>
              <Form.Control type='password' ref={passwordConfirmRef} required/>
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-4' type='submit'>Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-4'>
        Have an account? <Link to='/signin'>Log In</Link>
      </div>
    </div>
  );
}

export default Login;
