// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration for the first app
// Firebase configuration for the first part of your code
const firebaseConfig1 = {
  apiKey: "AIzaSyBrR974V6STStiLMb-ZOd1funl8awjNLiY",
  authDomain: "pdfupload-4e62e.firebaseapp.com",
  projectId: "pdfupload-4e62e",
  storageBucket: "pdfupload-4e62e.appspot.com",
  messagingSenderId: "153819526219",
  appId: "1:153819526219:web:0fb78764bdd18e88e049ce"
};

// Initialize the first Firebase app with a custom name
const app1 = initializeApp(firebaseConfig1, "App1");

// Export the auth object from the first app
// export const auth1 = getAuth(app1);

// Import the second Firebase app
import { initializeApp as initializeApp2 } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration for the second app
const firebaseConfig2 = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-auth-18120.firebaseapp.com",
  projectId: "mern-auth-18120",
  storageBucket: "mern-auth-18120.appspot.com",
  messagingSenderId: "411292307572",
  appId: "1:411292307572:web:a5c4a05f720dc52c384121"
};

// Initialize the second Firebase app with a custom name
export const app2 = initializeApp2(firebaseConfig2, "App2");
// Export the second app if needed
export const auth2 = getAuth(app2);

// Initialize Firebase for the first configuration
// export const app1 = initializeApp(firebaseConfig1);
const storage1 = getStorage(app1);

export {storage1};
