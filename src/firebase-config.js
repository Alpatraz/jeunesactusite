// Importation des modules nécessaires de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Récupérer l'instance de Firestore
const firestore = getFirestore(app);

// Exporter firestore
export { firestore };
