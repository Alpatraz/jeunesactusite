import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import './App.css';

function Summary() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [regionFilter, setRegionFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState('Chargement du résumé...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      const newsCollection = collection(firestore, 'actus');
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map(doc => doc.data());
      setNews(newsData);
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
    const newsText = filtered.slice(0, 10).map(item => `${item.title}: ${item.summary}`).join('\n');

    if (!newsText.trim()) {
      setSummary("Aucun résumé généré.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://zoomactu.netlify.app",
          "X-Title": "ZoomActu"
        },
        body: JSON.stringify({
          model: process.env.REACT_APP_OPENROUTER_MODEL || "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "user",
              content: `Voici des actualités :\n${newsText}\n\nRédige un résumé concis, clair et en français, adapté à un public général.`
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const result = data?.choices?.[0]?.message?.content;

      if (result) {
        setSummary(result.trim());
      } else {
        console.error("Erreur API:", data);
        setSummary("Erreur : Résumé non généré");
      }
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
            <option value="Montréal">Montréal</option>
            <option value="Québec">Québec</option>
            <option value="Canada">Canada</option>
            <option value="États-Unis">États-Unis</option>
            <option value="France">France</option>
            <option value="Europe">Europe</option>
          </select>
        </div>

        <div>
          <label>Thème:</label>
          <select onChange={(e) => setThemeFilter(e.target.value)} value={themeFilter}>
            <option value="">Tous</option>
            <option value="politique">Politique</option>
            <option value="sport">Sport</option>
            <option value="culture">Culture</option>
            <option value="économie">Économie</option>
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
          <div key={index} className="news-card">
            <h4>{item.title}</h4>
            <p>{item.summary}</p>
            <p><a href={item.url} target="_blank" rel="noopener noreferrer">Lire plus</a></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Summary;
