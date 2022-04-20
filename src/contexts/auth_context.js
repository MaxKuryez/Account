import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../globals/firebase';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider( {children} ) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password){
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password){
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut();
  }

  async function getItemsByUID(userID) {
    const itemsCollection = await db.collection('items').where('uid', '==', userID);

    let tempDoc = [];
    return await itemsCollection.get().then((querySnapshot) => {
      const tempDoc = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() }
      });
      return tempDoc;
    });
  }

  async function setItemByUID(itemName, itemType, userID) {
    const itemsCollection = await db.collection('items');

    const itemID = await itemsCollection.add({
      uid: userID,
      type: itemType,
      name: itemName,
      createdAt: new Date().getTime(),
    }).then((docRef) => {
      return docRef.id;
    }).catch(err => {
      console.log('Item not added!', err);
    });

    return itemID;
  }

  async function deleteItemByID(itemID) {
    const itemsDelete = await db.collection('items').doc(itemID);

    if (!itemsDelete) return;

    const response = await itemsDelete.get()
    .then((doc) => {
      doc.ref.delete();
    }).catch(err => {
      console.log('Could not delete item!', err);
    });
  }

  async function editItemByID(itemName, itemType, itemID) {
    console.log(itemName, itemType, itemID);
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
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
  })

    return unsubscribe;
  }, []);

  const user = {
    currentUser,
    loading,
    signup,
    login,
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
