import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config'; // Assurez-vous que le chemin est correct

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
      <h1>Latest News</h1>
      <ul>
        {news.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
