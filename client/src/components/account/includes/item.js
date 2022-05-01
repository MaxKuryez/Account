import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import { useAuth } from '../../../contexts/auth_context';
import Popup from 'reactjs-popup';
import EditIcon from './svg/edit';
import RemoveIcon from './svg/file-x';
import '../account.scss';

export default function Account( props ) {
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const itemNameRef = useRef();
  const itemTypeRef = useRef();
  const itemImgRef = useRef();
  const { getItemsByUID, setItemByUID, deleteItemByID, editItemByID } = useAuth();
  let ImgFileTmp = null;

  async function addItem(e) {
    e.preventDefault();

    if ( !itemNameRef || !itemTypeRef || !itemNameRef.current || !itemTypeRef.current || !ImgFileTmp){
      setError('Could not add item.');
      return;
    }

    let itemName = itemNameRef.current.value;
    let itemType = itemTypeRef.current.value;

    try {
      setError('');

      await setItemByUID(itemName, itemType, ImgFileTmp, props.currentUser.uid).then((item) => {
        setItems(items => [{
          name: itemName,
          type: itemType,
          id: item.itemID,
          imgUrl: item.imgUrl,
        }, ...items]);
      });
    } catch (error) {
      error ? setError(error.message.replace(/Firebase: /,'')) : setError('Could not add item.');
    }

    ImgFileTmp = null;
  }

  async function editItem(e, id){
    e.preventDefault();

    let itemName = itemNameRef.current.value;
    let itemType = itemTypeRef.current.value;
    let imgUrl = '';

    if ( !itemNameRef || !itemTypeRef || !itemNameRef.current || !itemTypeRef.current){
      setError('Could not edit item.');
      return;
    }

    try {
      setError('');

      imgUrl = await editItemByID(itemName, itemType, ImgFileTmp, id);
    } catch (error) {
      error ? setError(error.message.replace(/Firebase: /,'')) : setError('Could not edit item.');
    }

    if (imgUrl) {
      const itemsTmpl = items.map(item => {
        if (item.id == id) {
          return {...item, name: itemName, type: itemType, imgUrl: imgUrl};
        }
        return item;
      });

      setItems(itemsTmpl);
    } else {
      const itemsTmpl = items.map(item => {
        if (item.id == id) {
          return {...item, name: itemName, type: itemType};
        }
        return item;
      });

      setItems(itemsTmpl);
    }
  }

  async function removeItem(e, id){
    e.preventDefault();

    try {
      setError('');
      await deleteItemByID(id).then(() => {
        renderItems();
      });
    } catch {
      setError('Could not delete item.');
    }
  }

  function  loadFile(e) {
    ImgFileTmp = e.target.files[0];
  }

  async function renderItems(){
      const userStoredItem = typeof localStorage.getItem('user') === 'string' ?
      JSON.parse(localStorage.getItem('user')) : localStorage.getItem('user');

      if (userStoredItem) {
        try {
          setError('');
          let userItems = await getItemsByUID(userStoredItem.uid);

          userItems && userItems.sort((b,a) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
          setItems(userItems);
        } catch (error) {
          error ? setError(error.message.replace(/Firebase: /,'')) : setError('Could not load items.');
        }
      }
    }

  useEffect(() => {
    renderItems();
  }, []);

  return (
    <div className='item-container mt-4'>
      <h2>Your Items:</h2>
      <Popup trigger={<div className='add-item btn btn-primary mt-1 mb-3'>Add Items</div>} position='center center'>
        {close => (
          <div>
            <Card className='item-card'>
              <Card.Body>
                <div className='item-header'>
                  <h2 className='info'>Item Info</h2>
                  <h2 className='close x-btn ' onClick={close}>x</h2>
                </div>
                <Form onSubmit={(e) => { close(); addItem(e); }}>
                  <Form.Group className='mt-3' id='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' ref={itemNameRef} required/>
                  </Form.Group>
                  <Form.Group className='mt-3' id='type'>
                    <Form.Label>Type</Form.Label>
                    <Form.Control type='type' ref={itemTypeRef} required/>
                  </Form.Group>
                  <Form.Group className='mt-3' id='img'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control type='file' onChange={loadFile} ref={itemImgRef} accept='image/*' required/>
                  </Form.Group>
                  <Button className='close w-100 mt-4' type='submit'>Add Item</Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}
      </Popup>
      {error && <Alert variant='danger'>{error}</Alert>}
      {items && items.length ?
        <><div className='items-table'>
          <div className='row item-col mb-2'>
            <div className='item-name item-element'>Item:</div>
            <div className='item-price item-element'>Type:</div>
          </div>
          {items.map((element, it) => {
            return (<div key={it}><div className='item-img'><img src={element.imgUrl}></img></div><div className='row item-col' id={element.id}>
              <div className='item-name item-element'>{element.name}</div>
              <div className='item-price item-element'>{element.type}</div>
              <Popup trigger={<div className='edit-item'><EditIcon/></div>} position='center center'>
                {close => (
                  <div>
                    <Card className='item-card'>
                      <Card.Body>
                        <div className='item-header'>
                          <h2 className='info'>Edit item</h2>
                          <h2 className='close x-btn ' onClick={close}>x</h2>
                        </div>
                        <Form onSubmit={(e) => { close(); editItem(e, element.id); }}>
                          <Form.Group className='mt-3' id='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' ref={itemNameRef} defaultValue={element.name} required/>
                          </Form.Group>
                          <Form.Group className='mt-3' id='type'>
                            <Form.Label>Type</Form.Label>
                            <Form.Control type='type' ref={itemTypeRef} defaultValue={element.type} required/>
                          </Form.Group>
                          <Form.Group className='mt-3' id='img'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='file' onChange={loadFile} ref={itemImgRef} accept='image/*'/>
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
                          <h2 className='info'>Delete an item?</h2>
                          <h2 className='close x-btn ' onClick={close}>x</h2>
                        </div>
                        <Form>
                        <div className='row item-col'>
                          <Button className='remove-col w-40 mt-4 col-sm-6'  onClick={(e) => { close(); removeItem(e, element.id); }} type='submit'>Delete</Button>
                          <Button className='remove-col w-40 mt-4 col-sm-6' onClick={(e) => { close(); }} type='submit'>Cancel</Button>
                        </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Popup>
            </div></div>);
          })}
        </div></> :
        <><div className='mb-3'>You do not have any items, please add some.</div></>}
    </div>
  );
}
