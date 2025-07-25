// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASFIvllfRmTPtqVwAapxNKm6_zQ5RP8Ug",
  authDomain: "shop-profit-calc.firebaseapp.com",
  projectId: "shop-profit-calc",
  storageBucket: "shop-profit-calc.appspot.com",
  messagingSenderId: "488937935373",
  appId: "1:488937935373:web:43747c7f97477b3f13fb44",
  measurementId: "G-ZT4LLEX1D2"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const firestore = getFirestore(app);
