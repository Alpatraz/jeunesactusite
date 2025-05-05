import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config';
import NewsList from './components/NewsList';

function App() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  
  // États pour les filtres
  const [regionFilter, setRegionFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const getNews = async () => {
      const newsCollection = await firestore.collection('news').get();
      const newsData = newsCollection.docs.map(doc => doc.data());
      setNews(newsData);
    };

    getNews();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = news;

    if (regionFilter) {
      filtered = filtered.filter(item => item.region === regionFilter);
    }

    if (themeFilter) {
      filtered = filtered.filter(item => item.theme === themeFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(item => item.date >= dateFilter);
    }

    setFilteredNews(filtered);
  }, [regionFilter, themeFilter, dateFilter, news]); // Re-filtre chaque fois qu'un filtre change

  return (
    <div className="App">
      <h1>Latest News</h1>

      {/* Section de filtres */}
      <div>
        <label>Region:</label>
        <select onChange={(e) => setRegionFilter(e.target.value)} value={regionFilter}>
          <option value="">All</option>
          <option value="Europe">Europe</option>
          <option value="America">America</option>
          <option value="Asia">Asia</option>
        </select>
      </div>

      <div>
        <label>Theme:</label>
        <select onChange={(e) => setThemeFilter(e.target.value)} value={themeFilter}>
          <option value="">All</option>
          <option value="Politics">Politics</option>
          <option value="Environment">Environment</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      <div>
        <label>Date (after):</label>
        <input type="date" onChange={(e) => setDateFilter(e.target.value)} value={dateFilter} />
      </div>

      {/* Affichage des résultats filtrés */}
      <NewsList news={filteredNews} />
    </div>
  );
}

export default App;
