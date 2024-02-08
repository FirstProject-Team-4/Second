// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1VIi7cSYs-MGQTBai7xyxmlUK9Pzt-NU",
  authDomain: "tripify-375f2.firebaseapp.com",
  projectId: "tripify-375f2",
  storageBucket: "tripify-375f2.appspot.com",
  messagingSenderId: "984030549158",
  appId: "1:984030549158:web:737cd48390d95aa1215067",
  databaseURL: "https://tripify-375f2-default-rtdb.europe-west1.firebasedatabase.app/"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);