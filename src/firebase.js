import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCS-vscvTlWAjW6ayzxqIJtLXTGwbd3jus",
    authDomain: "instagram-clone-6873d.firebaseapp.com",
    databaseURL: "https://instagram-clone-6873d.firebaseio.com",
    projectId: "instagram-clone-6873d",
    storageBucket: "instagram-clone-6873d.appspot.com",
    messagingSenderId: "1068727872153",
    appId: "1:1068727872153:web:fcfcdfbee0093f2754a608",
    measurementId: "G-2BWKZ0CETK"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  console.log("ABC auth::", auth, db)
  export  {db, auth, storage};
  //export default db;