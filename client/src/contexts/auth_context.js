import React, { useContext, useState, useEffect } from 'react';
import { auth, db, app, storage } from '../globals/firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider( {children} ) {
  const userStored = typeof localStorage.getItem('user') === 'string' && localStorage.getItem('user') !== '' ?
  JSON.parse(localStorage.getItem('user')) : localStorage.getItem('user');
  const [currentUser, setCurrentUser] = useState( userStored ? userStored : 0 );
  const [loading, setLoading] = useState(false);

  function signup(email, password){
    return fetch('/account/signup', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          setCurrentUser(0);
          setLoading(false);
          throw new Error(data);
      } else {
        setCurrentUser(data);
      }
      setLoading(false);
    });
  }

  async function signin(email, password){
    return fetch('/account/signin', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          setCurrentUser(0);
          setLoading(false);
          throw new Error(data);
      } else {
        setCurrentUser(data);
      }
      setLoading(false);
    });
  }

  function logout() {
    localStorage.setItem('user', 0);
    setCurrentUser('');
  }

  async function getItemsByUID(userID) {
    return fetch('/items/get', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        userID: userID,
      })
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          throw new Error(data);
      } else {
        return data;
      }
    });
  }

  async function setItemByUID(itemName, itemType, itemImg, userID) {
    const itemsCollection = db.collection('items');
    const fileRef = storage.child(itemImg.name);
    const item = {};

    await fileRef.put(itemImg)
    .then(() => {
      console.log('Image added');
    }).catch(err => {
      console.log('Image not added!', err);
    });

    item.imgUrl = await fileRef.getDownloadURL()
    .then((url) => {
      console.log('Url returned.');
      return url;
    }).catch(err => {
      console.log('Url not returned.', err);
    });;

    console.log(item.imgUrl);

    item.itemID = await itemsCollection.add({
      uid: userID,
      type: itemType,
      name: itemName,
      imgUrl: item.imgUrl,
      createdAt: new Date().getTime(),
    }).then((docRef) => {
      return docRef.id;
    }).catch(err => {
      console.log('Item not added!', err);
    });

    return item;
  }

  async function deleteItemByID(itemID) {
    return fetch('/items/delete', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        itemID: itemID,
      })
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          throw new Error(data);
      } else {
        return data;
      }
    });
  }

  async function editItemByID(itemName, itemType, itemImg, itemID) {
    const itemUpdate = db.collection('items').doc(itemID);

    if (itemImg) {
      const fileRef = storage.child(itemImg.name);

      await fileRef.put(itemImg)
      .then(() => {
        console.log('Image added');
      }).catch(err => {
        console.log('Image not added!', err);
      });
  
      let imgUrl = await fileRef.getDownloadURL()
      .then((url) => {
        console.log('Url returned.');
        return url;
      }).catch(err => {
        console.log('Url not returned.', err);
      });;

      const response = await itemUpdate.update({name: itemName, type: itemType, imgUrl: imgUrl})
      .then(() => {
        console.log('Item updated with img!');
      }).catch(err => {
        console.log('Item not updated with img!', err);
      });

      return imgUrl;
    } else {
      const response = await itemUpdate.update({name: itemName, type: itemType})
      .then(() => {
        console.log('Item updated!');
      }).catch(err => {
        console.log('Item not updated!', err);
      });

      return '';
    }
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  const user = {
    currentUser,
    loading,
    signup,
    signin,
    logout,
    getItemsByUID,
    setItemByUID,
    deleteItemByID,
    editItemByID,
  }

  return (
    <AuthContext.Provider value={user}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
