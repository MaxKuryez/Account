const firebase = require("firebase/compat/app");
require('firebase/compat/storage'); 
require('firebase/compat/auth');
require('firebase/compat/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCDSWz5o-Exx8iDrAXRaEpSfJB9hRlN7iM",
  authDomain: "barter-944e6.firebaseapp.com",
  projectId: "barter-944e6",
  storageBucket: "barter-944e6.appspot.com",
  messagingSenderId: "1084600070768",
  appId: "1:1084600070768:web:317f09c7afebaaa1be3ab5",
  measurementId: "G-XE65RTYSPM"
};

const firebaseConf = {};
firebaseConf.app = firebase.initializeApp(firebaseConfig);
firebaseConf.db = firebase.firestore();
firebaseConf.storage = firebaseConf.app.storage().ref();

module.exports = firebaseConf;