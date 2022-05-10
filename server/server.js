const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./config/firebase');
const fileUpload = require('express-fileupload');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(fileUpload());

app.post('/account/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Please fill the required inputs before logging in!');
  } else {
    await firebase.app.auth().signInWithEmailAndPassword(email, password).then(async user => {
      if (user) {
        const user = await firebase.app.auth().currentUser;
        await firebase.db.collection('users').where('uid', '==', user.uid).get().then((querySnapshot) => {
          querySnapshot.docs.map((doc) => {
            const userLogin = {
              uid: user.uid,
              email: user.email,
              id: doc.id,
            }
            res.json(userLogin);
          });
          }).catch(err => {
            res.status(400).json(err.message);
          });
        } else {
          res.status(400).json('User not found!');
        }
    }).catch(err => {
      res.status(400).json(err.message);
    });
  }
});

app.post('/account/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json('Please fill the required inputs before logging in!');
  } else {
    await firebase.app.auth().createUserWithEmailAndPassword(email, password).then(async user => {
      if (user) {
        const user = await firebase.app.auth().currentUser;
        await firebase.db.collection('users').add({
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
        }).then(( doc ) => {
          const userLogin = {
            uid: user.uid,
            email: user.email,
            id: doc.id,
          }
          res.json(userLogin);
        }).catch(err => {
          res.status(400).json(err.message);
        });
      } else {
          res.status(400).json('User not created!');
        }
    }).catch(err => {
      res.status(400).json(err.message);
    });
  }
});

app.post('/items/get', async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json('User id is empty');
  } else {
    await firebase.db.collection('items').where('uid', '==', userID).get().then((querySnapshot) => {
          const tempDoc = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
          });
          res.json(tempDoc);
    }).catch(err => {
      return res.status(400).json(err.message);
    });
  }
});

app.post('/items/add', async (req, res) => {
  if (!req.body.item) {
    return res.status(400).json('Not all data provided');
  }
  req.body.item = JSON.parse(req.body.item);
  const { itemName, itemType, userID } = req.body.item;
  const itemImg = req.files && req.files.file || 0;

  if (!userID || !itemName || !itemType) {
    return res.status(400).json('Not all data provided');
  } else {
    if (itemImg) {
      const fileRef = firebase.storage.child(itemImg.name);

      await fileRef.put(itemImg.data).then(() => {
      })
      .catch(err => {
        return res.status(400).json(err.message);
      });

      const imgUrl = await fileRef.getDownloadURL().then((url) => {
        return url;
      }).catch(err => {
        return res.status(400).json(err.message);
      });

      const ItemAdded = {
        uid: userID,
        type: itemType,
        name: itemName,
        imgUrl: imgUrl,
        createdAt: new Date().getTime(),
      }

      await firebase.db.collection('items').add(ItemAdded).then(() => {
        return res.json(ItemAdded);
      }).catch(err => {
        return res.status(400).json(err.message);
      });
    }
  }
});

app.post('/items/edit', async (req, res) => {
  if (!req.body.item) {
    return res.status(400).json('Not all data provided');
  }
  req.body.item = JSON.parse(req.body.item);
  const { itemName, itemType, itemID } = req.body.item;
  const itemImg = req.files && req.files.file || 0;

  if (!itemID || !itemName || !itemType) {
    return res.status(400).json('Not all data provided');
  } else {
    if (itemImg) {
      const fileRef = firebase.storage.child(itemImg.name);

      await fileRef.put(itemImg.data).then(() => {
      })
      .catch(err => {
        return res.status(400).json(err.message);
      });

      const imgUrl = await fileRef.getDownloadURL().then((url) => {
        return url;
      }).catch(err => {
        return res.status(400).json(err.message);
      });

      await firebase.db.collection('items').doc(itemID).update({name: itemName, type: itemType, imgUrl: imgUrl}).then(( data ) => {
        const ItemUpdated = {
          id: itemID,
          updated: true
        }
        res.json(ItemUpdated);
      }).catch(err => {
        return res.status(400).json(err.message);
      });
    } else {
      await firebase.db.collection('items').doc(itemID).update({name: itemName, type: itemType}).then((data) => {
        const ItemUpdated = {
          id: itemID,
          updated: true
        }
        res.json(ItemUpdated);
      }).catch(err => {
        return res.status(400).json(err.message);
      });
    }
    
  }
});

app.post('/items/delete', async (req, res) => {
  const { itemID } = req.body;
  if (!itemID) {
    return res.status(400).json('No item id');
  } else {
    await firebase.db.collection('items').doc(itemID).get().then((querySnapshot) => {
      querySnapshot.ref.delete();
      const ItemDeleted = {
        id: itemID,
        deleted: true
      }
      return res.json(ItemDeleted);
    }).catch(err => {
      return res.status(400).json(err.message);
    });
  }
});

app.post('/items/search', async (req, res) => {
  let { search } = req.body;
  await firebase.db.collection('items').where('uid', '!=', '').get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        });
        let respItems = [];
        tempDoc.map(item => {
          while (search.charAt(0) === ' ') {
            search = search.substring(1);
          }
          if (item && typeof item.name === 'string' && item.name.toLowerCase().includes(search.toLowerCase())) {
            item.label = item.name;
            respItems.push(item);
          }
        });
        res.json(respItems);
  }).catch(err => {
    return res.status(400).json(err.message);
  });
});

app.post('/address/add', async (req, res) => {
  const { name, surname, street, uid, phone, postal } = req.body;
  if (!name) {
    return res.status(400).json('Please provide name!');
  }
  if (!surname) {
    return res.status(400).json('Please provide surname!');
  }
  if (!uid) {
    return res.status(400).json('Something went wrong!');
  }
  if (!street) {
    return res.status(400).json('Provide the street!');
  }
  if (!phone) {
    return res.status(400).json('Provide the phone!');
  }
  if ( !/^\d+$/.test(phone) || phone.length < 9 || phone.length > 11) {
    return res.status(400).json('Provide the phone number between 9 and 11 digits!');
  }
  if (!postal) {
    return res.status(400).json('Provide the postal code!');
  }
  if ( !/^\d+$/.test(postal) || postal.length < 5 || postal.length > 6) {
    return res.status(400).json('Provide the postal code between 5 and 6 digits!');
  }
  const adddressAdded = {
    name: name,
    surname: surname,
    uid: uid,
    street: street,
    phone: phone,
    postal: postal,
    createdAt: new Date().getTime(),
  }
  await firebase.db.collection('addresses').add(adddressAdded).then(() => {
    return res.json(adddressAdded);
  }).catch(err => {
    return res.status(400).json(err.message);
  });
});

app.post('/address/edit', async (req, res) => {
  const { name, surname, street, uid, phone, postal, id } = req.body;
  if (!name) {
    return res.status(400).json('Please provide name!');
  }
  if (!surname) {
    return res.status(400).json('Please provide surname!');
  }
  if (!uid || !id) {
    return res.status(400).json('Something went wrong!');
  }
  if (!street) {
    return res.status(400).json('Provide the street!');
  }
  if (!phone) {
    return res.status(400).json('Provide the phone!');
  }
  if ( !/^\d+$/.test(phone) || phone.length < 9 || phone.length > 11) {
    return res.status(400).json('Provide the phone number between 9 and 11 digits!');
  }
  if (!postal) {
    return res.status(400).json('Provide the postal code!');
  }
  if ( !/^\d+$/.test(postal) || postal.length < 5 || postal.length > 6) {
    return res.status(400).json('Provide the postal code between 5 and 6 digits!');
  }
  const adddressAdded = {
    name: name,
    surname: surname,
    street: street,
    phone: phone,
    postal: postal,
    updatedAt: new Date().getTime(),
  }
  const addressRef = firebase.db.collection('addresses').doc(id);
  await addressRef.get().then(async address => {
    if (address && address.data() && address.data().uid == uid) {
      await addressRef.update(adddressAdded).then(( data ) => {
        const addressUpdated = {
          id: id,
          updated: true
        };
        res.json(addressUpdated);
      }).catch(err => {
        return res.status(400).json(err.message);
      });
    } else {
      return res.status(400).json('User id incorrect');
    }
  }).catch(err => {
    return res.status(400).json(err.message);
  });
});

app.post('/address/delete', async (req, res) => {
  const { uid, id } = req.body;
  if (!uid || !id) {
    return res.status(400).json('Something went wrong!');
  }
  const addressRef = firebase.db.collection('addresses').doc(id);
  await addressRef.get().then(async address => {
    if (address && address.data() && address.data().uid == uid) {
      await addressRef.delete().then(( data ) => {
        const addressUpdated = {
          id: id,
          deleted: true
        };
        res.json(addressUpdated);
      }).catch(err => {
        return res.status(400).json(err.message);
      });
    } else {
      return res.status(400).json('User id incorrect');
    }
  }).catch(err => {
    return res.status(400).json(err.message);
  });
  //if (!itemID) {
  //  return res.status(400).json('No item id');
  //} else {
  //  await firebase.db.collection('items').doc(itemID).get().then((querySnapshot) => {
  //    querySnapshot.ref.delete();
  //    const ItemDeleted = {
  //      id: itemID,
  //      deleted: true
  //    }
  //    return res.json(ItemDeleted);
  //  }).catch(err => {
  //    return res.status(400).json(err.message);
  //  });
  //}
});

app.post('/address/get', async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json('Address is empty');
  } else {
    await firebase.db.collection('addresses').where('uid', '==', userID).get().then((querySnapshot) => {
          const tempDoc = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
          });
          res.json(tempDoc);
    }).catch(err => {
      return res.status(400).json(err.message);
    });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
