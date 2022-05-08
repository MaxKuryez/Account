import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../../../contexts/auth_context';
import Popup from 'reactjs-popup';
import EditIcon from './svg/edit';
import RemoveIcon from './svg/file-x';
import '../account.scss';

export default function Account( props ) {
  const [error, setError] = useState('');
  const [errorMain, setErrorMain] = useState('');
  const [address, setAddress] = useState(null);
  const { setAddressByUID, getAddressByUID } = useAuth();
  const nameRef = useRef();
  const surnameRef = useRef();
  const streetRef = useRef();
  const phoneRef = useRef();
  const postalRef = useRef();

  async function addAdress(e, close) {
    e.preventDefault();

    let name = nameRef.current.value;
    let surname = surnameRef.current.value;
    let street = streetRef.current.value;
    let phone = phoneRef.current.value;
    let postal = postalRef.current.value;
    let uid = props.currentUser.id;

    try {
      setError('');
      await setAddressByUID(name, surname, uid, street, phone, postal).then((data) => {
        setAddress(data);
        close();
        renderAddress();
      });
    } catch (error) {
      error ? setError(error.message) : setError('Could not add an address.');
    }
  }

  async function editAddress(e, id){
    e.preventDefault();
    //edit address
  }

  async function removeAddress(e, id){
    e.preventDefault();
    //remove address
  }

  async function renderAddress(){
    const userStoredItem = typeof localStorage.getItem('user') === 'string' ?
    JSON.parse(localStorage.getItem('user')) : localStorage.getItem('user');

    if (userStoredItem) {
      try {
        setError('');
        let userAddress = await getAddressByUID(userStoredItem.id);
        if (userAddress && userAddress[0]) {
          setAddress(userAddress[0]);
        }
      } catch (error) {
        error ? setErrorMain(error.message.replace(/Firebase: /,'')) : setErrorMain('Could not load address.');
      }
    }
  }

  useEffect(() => {
    renderAddress();
  }, []);

  return (
    <div className='item-container mt-4'>
      <h2>Your Address:</h2>
      {errorMain && <Alert variant='danger'>{errorMain}</Alert>}
      <Popup trigger={<div className='add-item btn btn-primary mt-1 mb-3' hidden={address}>Add an Address</div>} position='center center'>
        {close => (
          <div>
            <Card className='item-card'>
              <Card.Body>
                <div className='item-header'>
                  <h2 className='info'>Provide the Address</h2>
                  <h2 className='close x-btn ' onClick={close}>x</h2>
                </div>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form onSubmit={(e) => { addAdress(e, close); }}>
                  <Form.Group className='mt-3' id='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' ref={nameRef} />
                  </Form.Group>
                  <Form.Group className='mt-3' id='type'>
                    <Form.Label>Surname</Form.Label>
                    <Form.Control type='type' ref={surnameRef} />
                  </Form.Group>
                  <Form.Group className='mt-3' id='type'>
                    <Form.Label>Street</Form.Label>
                    <Form.Control type='type' ref={streetRef} />
                  </Form.Group>
                  <Form.Group className='mt-3' id='type'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type='type' ref={phoneRef} />
                  </Form.Group>
                  <Form.Group className='mt-3' id='type'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control type='type' ref={postalRef} />
                  </Form.Group>
                  <Button className='close w-100 mt-4' type='submit'>Add an Address</Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}
      </Popup>
      {address ?
        <><div className='items-table'>
          <div className='row item-col mb-2'>
            <div className='item-name item-element'>Your Home Address:</div>
          </div>
            <div className='row item-col' id={address.id}>
              <div className='item-name item-element'>{address.name}</div>
              <div className='item-price item-element'>{address.surname}</div>
              <div className='item-price item-element'>{address.street}</div>
              <div className='item-price item-element'>{address.phone}</div>
              <div className='item-price item-element'>{address.postal}</div>
              <Popup trigger={<div className='edit-item'><EditIcon/></div>} position='center center'>
                {close => (
                  <div>
                    <Card className='item-card'>
                      <Card.Body>
                        <div className='item-header'>
                          <h2 className='info'>Edit an Address</h2>
                          <h2 className='close x-btn ' onClick={close}>x</h2>
                        </div>
                        <Form onSubmit={(e) => { close(); editAddress(e, address.id); }}>
                          <Form.Group className='mt-3' id='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' ref={nameRef} defaultValue={address.name}/>
                          </Form.Group>
                          <Form.Group className='mt-3' id='type'>
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type='type' ref={surnameRef} defaultValue={address.surname}/>
                          </Form.Group>
                          <Form.Group className='mt-3' id='type'>
                            <Form.Label>Street</Form.Label>
                            <Form.Control type='type' ref={streetRef} defaultValue={address.street}/>
                          </Form.Group>
                          <Form.Group className='mt-3' id='type'>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type='type' ref={phoneRef} defaultValue={address.phone}/>
                          </Form.Group>
                          <Form.Group className='mt-3' id='type'>
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control type='type' ref={postalRef} defaultValue={address.postal}/>
                          </Form.Group>
                          <Button className='close w-100 mt-4' type='submit'>Save</Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Popup>
              <Popup trigger={<h3 className='item-delete'><RemoveIcon /></h3>} position='center center'>
                {close => (
                  <div>
                    <Card className='item-card'>
                      <Card.Body>
                        <div className='item-header'>
                          <h2 className='info'>Delete an address?</h2>
                          <h2 className='close x-btn ' onClick={close}>x</h2>
                        </div>
                        <Form>
                        <div className='row item-col'>
                          <Button className='remove-col w-40 mt-4 col-sm-6'  onClick={(e) => { close(); removeAddress(e, address.id); }} type='submit'>Delete</Button>
                          <Button className='remove-col w-40 mt-4 col-sm-6' onClick={(e) => { close(); }} type='submit'>Cancel</Button>
                        </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Popup>
            </div>
        </div></> :
        <><div className='mb-3'>You do not have an address, please add some.</div></>}
    </div>
  );
}
