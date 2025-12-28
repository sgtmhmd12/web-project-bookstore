// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqnMkfPeuesjXyVyLjHFrF1CZtGvaJTrY",
  authDomain: "bookstore-a9003.firebaseapp.com",
  projectId: "bookstore-a9003",
  storageBucket: "bookstore-a9003.firebasestorage.app",
  messagingSenderId: "235613920862",
  appId: "1:235613920862:web:9e0589517042486e32decf",
  measurementId: "G-D0XP23JQW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);