// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNar_TM0tcQvHlAXAaWRX8b1iB_kUi5M0",
  authDomain: "college-scheduling.firebaseapp.com",
  projectId: "college-scheduling",
  storageBucket: "college-scheduling.firebasestorage.app",
  messagingSenderId: "611579554548",
  appId: "1:611579554548:web:5d1d87cd9359bb9e1ccca1",
  measurementId: "G-DK3W10Q0BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);