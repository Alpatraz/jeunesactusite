import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config';
import Header from './components/Header'; // Assurez-vous que le chemin est correct
import Footer from './components/Footer'; // Assurez-vous que le chemin est correct
import Filters from './components/Filters'; // Si vous avez un composant Filters
import NewsList from './components/NewsList'; // Composant pour afficher les articles

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const newsCollection = await firestore.collection('news').get();
      const newsData = newsCollection.docs.map(doc => doc.data());
      setNews(newsData);
    };

    getNews();
  }, []);

  return (
    <div className="App">
      <Header /> {/* Affichage du Header */}
      
      <h1>Latest News</h1>

      {/* Affichage des filtres */}
      <Filters />

      {/* Liste des articles */}
      <NewsList news={news} />

      <Footer /> {/* Affichage du Footer */}
    </div>
  );
}

export default App;
