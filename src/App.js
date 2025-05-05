// src/App.js
import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config'; // Assurez-vous que le chemin est correct

function App() {
  const [news, setNews] = useState([]);  // State pour stocker les données des actualités

  // Récupération des données depuis Firestore
  useEffect(() => {
    const getNews = async () => {
      try {
        // Récupération des données depuis la collection 'news' dans Firestore
        const newsCollection = await firestore.collection('news').get();
        // Extraction des données de chaque document
        const newsData = newsCollection.docs.map(doc => doc.data());
        setNews(newsData);  // Mettre à jour le state avec les données récupérées
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    getNews();  // Appeler la fonction de récupération des données
  }, []);  // Le tableau vide [] assure que cet effet ne s'exécute qu'une seule fois lors du chargement du composant

  return (
    <div className="App">
      <h1>Latest News</h1>
      <ul>
        {news.length === 0 ? (
          <li>Loading...</li>  // Afficher un message de chargement si aucune actualité n'est encore récupérée
        ) : (
          news.map((item, index) => (
            <li key={index}>{item.title}</li>  // Afficher chaque titre d'actualité
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
