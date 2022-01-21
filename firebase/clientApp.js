import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWB4k550bDqBjQwQCWtEZd0QwfgDafOrk",
  authDomain: "middleware-app-cea05.firebaseapp.com",
  projectId: "middleware-app-cea05",
  storageBucket: "middleware-app-cea05.appspot.com",
  messagingSenderId: "302801129199",
  appId: "1:302801129199:web:2c4d8583a036782052551a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
    db
};