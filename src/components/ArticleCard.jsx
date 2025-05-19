import React from 'react';
import './ArticleCard.css'; // Assure-toi que ce fichier est dans le même dossier ou bien importé correctement

const ArticleCard = ({ title, summary, url, publishedAt, region, theme }) => {
  const date = new Date(publishedAt).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="article-card">
      <h3 className="article-title">{title}</h3>
      <p className="article-summary">{summary}</p>
      <div className="article-tags">
        <span className="article-tag">🌍 {region || 'Inconnue'}</span>
        <span className="article-tag">📌 {theme || 'Général'}</span>
        <span className="article-tag">📅 {date}</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="article-link"
      >
        Lire l'article
      </a>
    </div>
  );
};

export default ArticleCard;
