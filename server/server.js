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
              id: user.uid,
              email: user.email,
              uid: doc.id,
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

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
