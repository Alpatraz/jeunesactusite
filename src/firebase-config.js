import { initializeApp } from "firebase/app";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD6G2PXLU6G95SDtUVVKzeqKFhH6Aahq44",
  authDomain: "zoom-actu.firebaseapp.com",
  projectId: "zoom-actu",
  storageBucket: "zoom-actu.firebasestorage.app",
  messagingSenderId: "174263526950",
  appId: "1:174263526950:web:e5c52d59b3e9c16e26e8e7",
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Exportation de la connexion à Firestore
export { firestore };
