import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../globals/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
    signup,
    login,
    logout,
    createUserDocument,
  }

  return (
    <AuthContext.Provider value={user}>
      {!loading && children}
    </AuthContext.Provider>
  );
}