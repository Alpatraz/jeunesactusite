import React, { useState } from 'react';
import './ArticleCard.css';

const ArticleCard = ({ title, summary, url, publishedAt, region, theme, age }) => {
  const [showInline, setShowInline] = useState(false);
  const [articleSummary, setArticleSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const date = new Date(publishedAt).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const generatePrompt = () => {
    if (age <= 8) {
      return `Rédige un résumé TRÈS simple pour un enfant de ${age} ans. Utilise des mots familiers, très simples, et des phrases très courtes. Évite tout vocabulaire compliqué.

Titre : ${title}

Contenu : ${summary}`;
    } else if (age <= 11) {
      return `Fais un résumé simple et clair pour un enfant de ${age} ans. Utilise un langage accessible, avec des phrases courtes mais informatives. Aide l’enfant à comprendre ce qu’il s’est passé.

Titre : ${title}

Contenu : ${summary}`;
    } else {
      return `Rédige un résumé facile à comprendre pour un jeune de ${age} ans. Utilise des phrases structurées, des mots précis mais compréhensibles. Rends le résumé informatif tout en restant accessible.

Titre : ${title}

Contenu : ${summary}`;
    }
  };

  const fetchSummary = async () => {
    if (articleSummary || loading) return;

    setLoading(true);
    try {
      const prompt = generatePrompt();
      const response = await fetch("https://jeunes-actu-guillaumese.replit.app/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, age })
      });

      const data = await response.json();
      setArticleSummary(data.summary || "Aucun résumé généré");
    } catch (error) {
      console.error(error);
      setArticleSummary("Erreur de génération du résumé");
    } finally {
      setLoading(false);
    }
  };

  const handleShowInline = async () => {
    if (!showInline) await fetchSummary();
    setShowInline(!showInline);
  };

  return (
    <div className="article-card">
      <h3 className="article-title" onClick={handleShowInline}>
        {title}
      </h3>

      <p className="article-summary-preview">{summary}</p>

      <div className="article-tags">
        <span className="article-tag">🌍 {region || 'Inconnue'}</span>
        <span className="article-tag">📌 {theme || 'Général'}</span>
        <span className="article-tag">📅 {date}</span>
      </div>

      <div className="article-links">
        <a href={url} target="_blank" rel="noopener noreferrer" className="article-link">Lire l'article</a>
        <span onClick={handleShowInline} className="article-link" style={{ cursor: 'pointer' }}>
          Voir le résumé adapté à l’âge
        </span>
      </div>

      {showInline && (
        <div className="article-summary-block">
          <h4>Résumé de l’article pour un enfant de {age} ans</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {loading ? '⏳ Résumé en cours...' : articleSummary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
