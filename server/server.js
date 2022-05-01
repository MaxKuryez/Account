const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('./config/firebase');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post('/account/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json('Please fill the required inputs before logging in!');
  } else {
    await firebase.app.auth().signInWithEmailAndPassword(email, password).then(async user => {
      if (user) {
        let user = await firebase.app.auth().currentUser;
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
        let user = await firebase.app.auth().currentUser;
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

app.post('/items/delete', async (req, res) => {
  const { itemID } = req.body;
  if (!itemID) {
    return res.status(400).json('No item id');
  } else {
    await firebase.db.collection('items').doc(itemID).get().then((querySnapshot) => {
      querySnapshot.ref.delete();
      const tempItemDeleted = {
        id: itemID,
        deleted: true
      }
      return res.json(tempItemDeleted);
    }).catch(err => {
      return res.status(400).json(err.message);
    });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
