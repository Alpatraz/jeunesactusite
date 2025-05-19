import React, { useEffect, useState } from 'react';
import { firestore } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import './Dossiers.css';

const defaultTopics = ["Ukraine", "Pape", "Gaza", "Climat", "Élections", "Canada"];

function Dossiers() {
  const [topics, setTopics] = useState(() => [...defaultTopics]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [articles, setArticles] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  const fetchArticles = async (topic) => {
    const articlesRef = collection(firestore, 'actus');
    const snapshot = await getDocs(articlesRef);
    const data = snapshot.docs.map(doc => doc.data());

    const filtered = data.filter(article => {
      const titleMatch = article.title?.toLowerCase().includes(topic.toLowerCase());
      const summaryMatch = article.summary?.toLowerCase().includes(topic.toLowerCase());
      return titleMatch || summaryMatch;
    });

    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    setArticles(filtered);
  };

  const handleAddTopic = () => {
    if (newTopic && !topics.includes(newTopic)) {
      setTopics(prev => [...prev, newTopic]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topic) => {
    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer le dossier "${topic}" ?`);
    if (confirmDelete) {
      setTopics(prev => prev.filter(t => t !== topic));
      if (selectedTopic === topic) {
        setSelectedTopic(null);
        setArticles([]);
      }
    }
  };

  useEffect(() => {
    if (selectedTopic) {
      fetchArticles(selectedTopic);
    }
  }, [selectedTopic]);

  return (
    <div className="DossiersActu">
      <h1>Grands dossiers d'actualité</h1>
      <p>Retrouvez ici les grands sujets qui font l'actualité. Cliquez pour explorer les articles associés.</p>

      <div className="topic-input">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Ajouter un nouveau sujet..."
        />
        <button onClick={handleAddTopic}>Ajouter</button>
      </div>

      <div className="topic-list">
        {topics.map((topic, index) => (
          <div key={index} className={`topic-item ${selectedTopic === topic ? 'active' : ''}`}>
            <span onClick={() => setSelectedTopic(topic)}>{topic}</span>
            <button onClick={() => handleRemoveTopic(topic)}>🗑️</button>
          </div>
        ))}
      </div>

      <div className="article-results">
        {selectedTopic && (
          <>
            <h2>Articles liés à "{selectedTopic}"</h2>
            {articles.length === 0 ? (
              <p>Aucun article trouvé pour ce sujet.</p>
            ) : (
              <div className="article-cards">
                {articles.map((a, i) => (
                  <div key={i} className="article-card">
                    <h3>{a.title}</h3>
                    <p className="article-summary">{a.summary}</p>
                    <div className="article-tags">
                      <span>🌍 {a.region || 'Inconnue'}</span>
                      <span>📌 {a.theme || 'Général'}</span>
                      <span>📅 {new Date(a.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <a href={a.url} target="_blank" rel="noreferrer">Lire l'article</a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dossiers;
