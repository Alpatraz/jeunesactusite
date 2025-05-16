import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Assurez-vous que cette ligne est présente
import { getAuth } from "firebase/auth";  // Si vous avez besoin de l'authentification

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD6G2PXLU6G95SDtUVVKzeqKFhH6Aahq44",
  authDomain: "zoom-actu.firebaseapp.com",
  projectId: "zoom-actu",
  storageBucket: "zoom-actu.firebasestorage.app",
  messagingSenderId: "174263526950",
  appId: "1:174263526950:web:e5c52d59b3e9c16e26e8e7",
  measurementId: "G-75JK7R6F96"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Firestore et Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
