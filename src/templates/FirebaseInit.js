import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyDm332j0CkeLLDRsqcldostq_eoD_ojFvc",
  authDomain: "ultrashow-123.firebaseapp.com",
  databaseURL: "https://ultrashow-123-default-rtdb.firebaseio.com",
  projectId: "ultrashow-123",
  storageBucket: "ultrashow-123.appspot.com",
  messagingSenderId: "204047224085",
  appId: "1:204047224085:web:a3fadc904ffbf8ec99ed1c",
  measurementId: "G-L3C9WPB96T",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      // Signed in..
      console.log("Signed in");
    })
    .catch((error) => {
      var errorCode = error.code;
      console.log("🚀 ~ errorCode", errorCode);
      var errorMessage = error.message;
      console.log("🚀 ~ errorMessage", errorMessage);
      // ...
    });
} else {
  firebase.app(); // if already initialized, use that one
}

export const UserContext = React.createContext(null);

function FirebaseInit({children}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        setUser(user);
        // ...
      } else {
        // User is signed out
        // ...
        setUser(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
        {/* <Intro user={user} path="/" /> */}
        {children}
    </UserContext.Provider>
  );
}

export default FirebaseInit;
