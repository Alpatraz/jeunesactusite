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
  const [dateFilter, setDateFilter] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [age, setAge] = useState(9);
  const [summary, setSummary] = useState('Chargement du résumé...');
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(10);

  useEffect(() => {
    const getNews = async () => {
      const newsCollection = query(collection(firestore, 'actus'), orderBy("publishedAt", "desc"));
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map(doc => doc.data());
      setNews(newsData);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setCurrentPage(1);
    setFilteredNews(filtered);
    if (filtered.length > 0) {
      generateSummary(filtered);
    } else {
      setSummary("Aucun article ne correspond à votre sélection.");
    }
  }, [regionFilter, themeFilter, dateFilter, searchQuery, news, age]);

  const generateSummary = async (filtered) => {
    if (!filtered || filtered.length === 0) {
      setSummary("Aucun résumé généré.");
      return;
    }

    let intro = "📰 Voici ce qui s’est passé récemment dans le monde :";
    if (regionFilter && themeFilter) {
      intro = `🌍 Voici les nouvelles sur **${themeFilter}** en **${regionFilter}**, ces derniers jours :`;
    } else if (regionFilter) {
      intro = `🌍 Voici ce qui s’est passé récemment en **${regionFilter}** :`;
    } else if (themeFilter) {
      intro = `📌 Voici les dernières nouvelles dans le domaine **${themeFilter}** :`;
    }
    if (dateFilter === '24h') intro += ` (moins de 24h)`;
    if (dateFilter === '7d') intro += ` (cette semaine)`;
    if (dateFilter === '1m') intro += ` (ce mois-ci)`;

    const groupedByTheme = {};
    filtered.slice(0, 15).forEach(item => {
      const theme = item.theme?.trim() || "Autres";
      if (!groupedByTheme[theme]) groupedByTheme[theme] = [];
      groupedByTheme[theme].push(`- ${item.title}`);
    });

    const thematicBlocks = Object.entries(groupedByTheme).map(([theme, articles]) => {
      return `\n\n🟢 ${theme}\n${articles.slice(0, 3).join('\n')}`;
    }).join('');

    const fullPrompt = `Résume les actualités suivantes pour un enfant de ${age} ans. Utilise un langage clair et adapté à son âge. Conserve les thèmes séparés.\n\n${intro}\n${thematicBlocks}`;

    setLoading(true);
    try {
      const response = await fetch("https://jeunes-actu-guillaumese.replit.app/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt })
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

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredNews.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);

  return (
    <div className="Summary">
      <h1>Résumé de l'actualité</h1>

      <div className="filters-container">
        <div>
          <label>Âge :</label>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={6} max={17} />
        </div>

        <div>
          <label>Région:</label>
          <select onChange={(e) => setRegionFilter(e.target.value)} value={regionFilter}>
            <option value="">Tous</option>
            {regions.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label>Thème:</label>
          <select onChange={(e) => setThemeFilter(e.target.value)} value={themeFilter}>
            <option value="">Tous</option>
            {themes.map((t, i) => <option key={i} value={t}>{t}</option>)}
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

        <div>
          <label>Articles par page :</label>
          <select value={articlesPerPage} onChange={(e) => setArticlesPerPage(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <h2>Articles trouvés : {filteredNews.length}</h2>

      <div className="summary-box">
        <h3>Résumé :</h3>
        {loading ? <p>⏳ Résumé en cours...</p> : <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>}
      </div>

      <div className="news-grid">
        {currentArticles.map((item, index) => (
          <ArticleCard key={index} {...item} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
