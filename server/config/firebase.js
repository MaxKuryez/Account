// Import the functions you need from the SDKs you need
const firebase = require("firebase/compat/app");
require('firebase/compat/storage'); 
require('firebase/compat/auth');
require('firebase/compat/firestore');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDSWz5o-Exx8iDrAXRaEpSfJB9hRlN7iM",
  authDomain: "barter-944e6.firebaseapp.com",
  projectId: "barter-944e6",
  storageBucket: "barter-944e6.appspot.com",
  messagingSenderId: "1084600070768",
  appId: "1:1084600070768:web:317f09c7afebaaa1be3ab5",
  measurementId: "G-XE65RTYSPM"
};

// Initialize Firebase
const firebaseConf = {};
firebaseConf.app = firebase.initializeApp(firebaseConfig);
firebaseConf.db = firebase.firestore();

module.exports = firebaseConf;