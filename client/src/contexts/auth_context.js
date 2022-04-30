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
    return auth.createUserWithEmailAndPassword(email, password);
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
            throw new Error(data);
        } else {
          setCurrentUser(data);
        }
        setLoading(false);
    });
  }

  function logout() {
    //return auth.signOut();
    localStorage.setItem('user', 0);
    setCurrentUser('');
  }

  async function getItemsByUID(userID) {
    console.log('testing user id: ' + userID);
    const itemsCollection = db.collection('items').where('uid', '==', userID);
    console.log('here'); 
    return await itemsCollection.get().then((querySnapshot) => {
      console.log('and heree: ' + querySnapshot);  
      const tempDoc = querySnapshot.docs.map((doc) => {
        console.log('and here: ' + doc);  
        return { id: doc.id, ...doc.data() }
      });
      return tempDoc;
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
    const itemsDelete = db.collection('items').doc(itemID);

    if (!itemsDelete) return;

    const response = await itemsDelete.get()
    .then((doc) => {
      doc.ref.delete();
    }).catch(err => {
      console.log('Could not delete item!', err);
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

  async function createUserDocument(user){
    if (!user) {return};

    let userEmail = user.user.multiFactor.user.email;
    let userID = user.user.multiFactor.user.uid;

    const usersCollection = db.collection('users');

    const response = await usersCollection.add({
      uid: userID,
      email: userEmail,
      createdAt: new Date(),
    }).then(() => {
      console.log('User added!');
    }).catch(err => {
      console.log('User not added!', err);
    });
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
    createUserDocument,
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
