import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './App.css';
import ArticleCard from './components/ArticleCard';

function Summary() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [regionFilter, setRegionFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState('Chargement du résumé...');
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const newsCollection = query(collection(firestore, 'actus'), orderBy("publishedAt", "desc"));
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map(doc => doc.data());
      setNews(newsData);

      // Extraire thèmes et régions uniques
      const themeSet = new Set();
      const regionSet = new Set();
      newsData.forEach(item => {
        if (item.theme) themeSet.add(item.theme.trim());
        if (item.region) regionSet.add(item.region.trim());
      });
      setThemes([...themeSet].sort());
      setRegions([...regionSet].sort());
    };
    getNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    if (regionFilter) {
      filtered = filtered.filter(item =>
        item.region && item.region.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }

    if (themeFilter) {
      filtered = filtered.filter(item =>
        item.theme && item.theme.toLowerCase().includes(themeFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(item => {
        const publishedDate = new Date(item.publishedAt);
        const currentDate = new Date();
        switch (dateFilter) {
          case '24h':
            return currentDate - publishedDate < 24 * 60 * 60 * 1000;
          case '7d':
            return currentDate - publishedDate < 7 * 24 * 60 * 60 * 1000;
          case '1m':
            return currentDate - publishedDate < 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    if (filtered.length > 0) {
      generateSummary(filtered);
    } else {
      setSummary("Aucun article ne correspond à votre sélection.");
    }
  }, [regionFilter, themeFilter, dateFilter, searchQuery, news]);

  const generateSummary = async (filtered) => {
    const newsText = filtered.slice(0, 10).map(item =>
      `${item.title}: ${item.summary}`
    ).join('\n');

    if (!newsText.trim()) {
      setSummary("Aucun résumé généré.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://jeunes-actu-guillaumese.replit.app/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newsText })
      });

      const data = await response.json();
      const result = data?.summary;

      setSummary(result?.trim() || "Erreur : Résumé non généré");
    } catch (error) {
      console.error("Erreur de requête:", error);
      setSummary("Erreur : Résumé non généré");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Summary">
      <h1>Résumé de l'actualité</h1>

      <div className="filters-container">
        <div>
          <label>Région:</label>
          <select onChange={(e) => setRegionFilter(e.target.value)} value={regionFilter}>
            <option value="">Tous</option>
            {regions.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Thème:</label>
          <select onChange={(e) => setThemeFilter(e.target.value)} value={themeFilter}>
            <option value="">Tous</option>
            {themes.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Date:</label>
          <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
            <option value="">Tous</option>
            <option value="24h">Moins de 24h</option>
            <option value="7d">Moins de 7 jours</option>
            <option value="1m">Moins d'un mois</option>
          </select>
        </div>

        <div>
          <label>Recherche:</label>
          <input
            type="text"
            placeholder="Rechercher..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      <h2>Nombre d'articles : {filteredNews.length}</h2>

      <div className="summary-box">
        <h3>Résumé :</h3>
        {loading ? <p>⏳ Résumé en cours...</p> : <p>{summary}</p>}
      </div>

      <div className="news-grid">
        {filteredNews.map((item, index) => (
          <ArticleCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Summary;
