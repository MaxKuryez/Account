import React, { useContext, useState, useEffect } from 'react';

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
    let data = new FormData();
    data.append('file', itemImg)
    data.append('item', JSON.stringify({
      itemName: itemName,
      itemType: itemType,
      userID: userID
    }));

    return fetch('/items/add', {
      method: 'POST',
      body: data
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
    let data = new FormData();
    itemImg && data.append('file', itemImg)
    data.append('item', JSON.stringify({
      itemName: itemName,
      itemType: itemType,
      itemID: itemID,
    }));

    return fetch('/items/edit', {
      method: 'POST',
      body: data
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

  async function setAddressByUID(name, surname, uid, street, phone, postal) {
    return fetch('/address/add', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: name,
        surname: surname,
        uid: uid,
        street: street,
        phone: phone,
        postal: postal
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

  async function getAddressByUID(userID) {
    return fetch('/address/get', {
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

  async function editAddressByUID(name, surname, uid, street, phone, postal, id) {
    return fetch('/address/edit', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name: name,
        surname: surname,
        uid: uid,
        street: street,
        phone: phone,
        postal: postal,
        id: id
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

  async function deleteAddressbyID(id, uid) {
    return fetch('/address/delete', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        id: id,
        uid: uid
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
    setAddressByUID,
    getAddressByUID,
    editAddressByUID,
    deleteAddressbyID,
  }

  return (
    <AuthContext.Provider value={user}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
