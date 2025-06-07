import React, { useState, useEffect, useCallback } from 'react';
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

      const normalizeRegion = (region) => {
        if (!region) return null;
        const r = region.trim().toLowerCase();
        if (["test", "unknown", "n/a", "", "inconnue", "testland"].includes(r)) return null;
        const map = {
          "europe": "Europe",
          "eu": "Europe",
          "usa": "États-Unis",
          "us": "États-Unis",
          "united states": "États-Unis",
          "canada": "Canada",
          "quebec": "Québec",
          "asie": "Asie",
          "asia": "Asie",
          "africa": "Afrique",
          "afrique": "Afrique",
          "latin america": "Amérique latine",
          "south america": "Amérique du Sud",
          "north america": "Amérique du Nord",
          "monde": "Monde"
        };
        return map[r] || r.charAt(0).toUpperCase() + r.slice(1);
      };

      const newsData = newsSnapshot.docs.map(doc => {
        const data = doc.data();

        // Thème
        let theme = data.theme?.trim().toLowerCase();
        if (!theme || theme === "test") {
          console.warn("🟠 Thème corrigé → 'Général' :", data.title);
          theme = "Général";
        } else {
          theme = theme.charAt(0).toUpperCase() + theme.slice(1);
        }

        // Région
        let region = normalizeRegion(data.region);
        if (!region) {
          console.warn("🟠 Région corrigée → 'Monde' :", data.title);
          region = "Monde";
        }

        return { ...data, theme, region };
      });

      setNews(newsData);

      const themeSet = new Set();
      const regionSet = new Set();
      newsData.forEach(item => {
        themeSet.add(item.theme);
        regionSet.add(item.region);
      });

      setThemes([...themeSet].sort());
      setRegions([...regionSet].sort());
    };

    getNews();
  }, []);

  const generateSummary = useCallback(async (filtered) => {
    if (!filtered || filtered.length === 0) {
      setSummary("Aucun résumé généré.");
      return;
    }

    let intro = `📰 Voici ce qui s’est passé`;
    if (regionFilter && themeFilter) {
      intro += ` dans le domaine **${themeFilter}** en **${regionFilter}**`;
    } else if (regionFilter) {
      intro += ` en **${regionFilter}**`;
    } else if (themeFilter) {
      intro += ` dans le domaine **${themeFilter}**`;
    } else {
      intro += ` récemment dans le monde`;
    }

    if (dateFilter === '24h') intro += ` (moins de 24h)`;
    else if (dateFilter === '7d') intro += ` (cette semaine)`;
    else if (dateFilter === '1m') intro += ` (ce mois-ci)`;
    intro += ` :`;

    const groupedByTheme = {};
    filtered.slice(0, 15).forEach(item => {
      const theme = item.theme?.trim();
      const normalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
      if (!groupedByTheme[normalizedTheme]) groupedByTheme[normalizedTheme] = [];
      groupedByTheme[normalizedTheme].push(`- ${item.title}`);
    });

    const thematicBlocks = Object.entries(groupedByTheme).map(([theme, articles]) => {
      return `\n\n🟢 ${theme}\n${articles.slice(0, 3).join('\n')}`;
    }).join('');

    let prompt = "";
    if (age <= 8) {
      prompt = `Résume ces nouvelles pour un enfant de ${age} ans. Utilise des phrases TRÈS simples, des mots familiers, un ton rassurant. N’explique pas tout : simplifie.\n\n${intro}\n${thematicBlocks}`;
    } else if (age <= 11) {
      prompt = `Fais un résumé adapté à un enfant de ${age} ans. Utilise des phrases courtes et claires. Aide à comprendre ce qu’il se passe dans le monde.\n\n${intro}\n${thematicBlocks}`;
    } else {
      prompt = `Rédige un résumé accessible pour un jeune de ${age} ans. Utilise un langage compréhensible, structuré, pédagogique.\n\n${intro}\n${thematicBlocks}`;
    }

    setLoading(true);
    try {
      const response = await fetch("https://jeunes-actu-guillaumese.replit.app/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
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
  }, [regionFilter, themeFilter, dateFilter, age]);

  useEffect(() => {
    let filtered = news;

    if (regionFilter) {
      filtered = filtered.filter(item =>
        item.region && item.region.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }

    if (themeFilter) {
      filtered = filtered.filter(item =>
        item.theme && item.theme.toLowerCase() === themeFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(item => {
        const publishedDate = item.publishedAt?.toDate?.() || new Date(item.publishedAt);
        const currentDate = new Date();
        const diff = currentDate - publishedDate;
        if (dateFilter === '24h') return diff < 24 * 60 * 60 * 1000;
        if (dateFilter === '7d') return diff < 7 * 24 * 60 * 60 * 1000;
        if (dateFilter === '1m') return diff < 30 * 24 * 60 * 60 * 1000;
        return true;
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
  }, [regionFilter, themeFilter, dateFilter, searchQuery, news, age, generateSummary]);

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
          <ArticleCard key={index} {...item} age={age} />
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
