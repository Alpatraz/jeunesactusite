import React, { useState, useEffect } from 'react';
import { firestore } from './firebase-config'; // Assurez-vous que firestore est correctement exporté depuis votre fichier firebase-config.js
import { collection, getDocs } from 'firebase/firestore'; // Utilisation de la nouvelle API modulaire de Firebase v9+

function App() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);

  const [regionFilter, setRegionFilter] = useState(''); // Valeur par défaut (tous)
  const [themeFilter, setThemeFilter] = useState(''); // Valeur par défaut (tous)
  const [dateFilter, setDateFilter] = useState(''); // Valeur par défaut (tous)
  const [searchQuery, setSearchQuery] = useState(''); // Recherche personnalisée

  // Fonction pour récupérer les actualités
  useEffect(() => {
    const getNews = async () => {
      // Utilisation de la nouvelle méthode modulaire pour obtenir la collection 'actus'
      const newsCollection = collection(firestore, 'actus');
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map(doc => doc.data());
      
      console.log("Données récupérées :", newsData); // Affiche les données récupérées dans la console du navigateur

      setNews(newsData); // Met à jour l'état avec les données récupérées
    };

    getNews();
  }, []); // Ce useEffect ne s'exécute qu'une seule fois lors du premier rendu

  // Filtrage des actualités en fonction des filtres
  useEffect(() => {
    let filtered = news;

    // Vérifier la valeur du filtre région avant le filtrage
    console.log("Valeur du filtre région :", regionFilter);

    // Filtrage par région
    if (regionFilter) {
      filtered = filtered.filter(item => item.region.toLowerCase().includes(regionFilter.toLowerCase()));
      console.log("Après filtre région :", filtered); // Vérifie les résultats après le filtre de la région
    } else {
      console.log("Pas de filtre région appliqué, affichage de toutes les actualités.");
    }

    // Filtrage par thème
    if (themeFilter) {
      filtered = filtered.filter(item => item.theme.toLowerCase().includes(themeFilter.toLowerCase()));
      console.log("Après filtre thème :", filtered); // Vérifie les résultats après le filtre du thème
    }

    // Filtrage par date
    if (dateFilter) {
      filtered = filtered.filter(item => {
        const publishedDate = new Date(item.publishedAt);
        const currentDate = new Date();
        switch (dateFilter) {
          case '24h':
            return (currentDate - publishedDate) < 24 * 60 * 60 * 1000; // 24 heures
          case '7d':
            return (currentDate - publishedDate) < 7 * 24 * 60 * 60 * 1000; // 7 jours
          case '1m':
            return (currentDate - publishedDate) < 30 * 24 * 60 * 60 * 1000; // 1 mois
          case 'older':
            return (currentDate - publishedDate) > 30 * 24 * 60 * 60 * 1000; // Plus vieux
          default:
            return true;
        }
      });
      console.log("Après filtre date :", filtered); // Vérifie les résultats après le filtre de la date
    }

    // Recherche personnalisée
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Après recherche personnalisée :", filtered); // Vérifie les résultats après la recherche personnalisée
    }

    setFilteredNews(filtered);
  }, [regionFilter, themeFilter, dateFilter, searchQuery, news]);

  return (
    <div className="App">
      <h1>Dernières actus</h1>

      {/* Conteneur des filtres */}
      <div className="filters-container">
        {/* Filtre par région */}
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

        {/* Filtre par thème */}
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

        {/* Filtre par date */}
        <div>
          <label>Date:</label>
          <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
            <option value="">Tous</option>
            <option value="24h">Moins de 24h</option>
            <option value="7d">Moins de 7 jours</option>
            <option value="1m">Moins d'un mois</option>
            <option value="older">Plus vieux</option>
          </select>
        </div>

        {/* Recherche personnalisée */}
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

      {/* Affichage des résultats filtrés */}
      <ul>
        {filteredNews.length === 0 ? (
          <li>Aucun résultat trouvé</li>
        ) : (
          filteredNews.map((item, index) => (
            <li key={index}>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <p><a href={item.url} target="_blank" rel="noopener noreferrer">Lire plus</a></p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
