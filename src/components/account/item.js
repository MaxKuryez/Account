import React, { useState, useRef} from 'react';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/auth_context';
import Popup from 'reactjs-popup';
import './account.scss';

export default function Account( props ) {
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const itemNameRef = useRef();
  const itemTypeRef = useRef();

  async function Additem(e) {
    e.preventDefault();

    try {
      setError('');
      setItems(items => [...items, {
        name: itemNameRef.current.value,
        type: itemTypeRef.current.value,
      }]);
      console.log(items);
      await console.log('Your item:', itemNameRef.current.value, itemTypeRef.current.value);
    } catch (error) {
      error ? setError(error.message.replace(/Firebase: /,'')) : setError('Could not add item.');
    }

  }

  console.log(props.currentUser.email, props.currentUser.uid);

  return (
    <div className='item-container mt-4'>
      <h2>Your Items:</h2>
      {error && <Alert variant='danger'>{error}</Alert>}
      {items && items.length ?
        <><div>
          {items.map(element => {
            return (<div className='row item-col'>
              <div className='item-name col-sm-6'>{element.name}</div>
              <div className='item-price col-sm-6'>{element.type}
            </div></div>);
          })}
        </div></> :
        <><div>You do not have any items, please add some.</div></>}
        <Popup trigger={<div className='add-item btn btn-primary mt-4 mb-2'>Add Items</div>} position='center center'>
          {close => (
            <div>
              <Card>
                <Card.Body>
                  <div className='item-header'>
                    <h2 className='info'>Item Info</h2>
                    <h2 className='close x-btn ' onClick={close}>x</h2>
                  </div>
                  <Form onSubmit={(e) => { Additem(e); close();}}>
                    <Form.Group className='mt-3' id='name'>
                      <Form.Label>Name</Form.Label>
                      <Form.Control type='name' ref={itemNameRef} required/>
                    </Form.Group>
                    <Form.Group className='mt-3' id='type'>
                      <Form.Label>Type</Form.Label>
                      <Form.Control type='type' ref={itemTypeRef} required/>
                    </Form.Group>
                    <Button disabled={false} className='close w-100 mt-4' type='submit'>Add Item</Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          )}
       </Popup>
    </div>
  );
}
