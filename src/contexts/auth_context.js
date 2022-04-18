import React, { useContext, useState, useEffect } from 'react';
import { auth, firestore } from '../globals/firebase';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider( {children} ) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password){
    return auth.createUserWithEmailAndPassword(email, password)
    //.catch(function(err) {
    //  const errorCode = err.code;
    //  const errorMsg = err.message;
    //  return err.message
    //});
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

    const userTable = firestore.doc(`users/${userID}`);
    const snapshot = await userTable.get();

    if (!snapshot) {
      const {email} = userEmail;
      const {uid} = userID;
      try {
        userTable.set({
          email,
          userID,
          createdAt: new Date(),
        });
      } catch(error) {
        console.log('Err when creating user', error);
      }
    }
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