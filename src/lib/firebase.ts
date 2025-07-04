import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVOSRh-gMmIcjQZx-RQaGP2IU9zvuFUsg",
  authDomain: "humanity-verse-app.firebaseapp.com",
  projectId: "humanity-verse-app",
  storageBucket: "humanity-verse-app.appspot.com", 
  messagingSenderId: "202587346072",
  appId: "1:202587346072:web:c8f9afa871ad1b50292ced",
  measurementId: "G-PRJ7WTMK26"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
