import firebase from "firebase/app";

import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlMgtTKOK_bDk-NWDq3qx0FLVQRNmb8Lg",

  authDomain: "recipe-book-cc88f.firebaseapp.com",

  projectId: "recipe-book-cc88f",

  storageBucket: "recipe-book-cc88f.appspot.com",

  messagingSenderId: "19806749895",

  appId: "1:19806749895:web:326dd96f113ab50a46aae2",

  measurementId: "G-9TVBGR6DS2",
};
// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectRecipeBook = firebase.firestore();

export { projectRecipeBook };
