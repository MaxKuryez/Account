import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../globals/firebase';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider( {children} ) {
  const [currentUser, setCurrentUser] = useState();

  function signup(email, password){
    auth.createUserWithEmailAndPassword(email, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    })

    return unsubscribe;
  }, []);

  const user = {
    currentUser,
    signup
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}