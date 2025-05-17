import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase-config';

function Sources() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      const newsCollection = collection(firestore, 'actus');
      const snapshot = await getDocs(newsCollection);
      const articles = snapshot.docs.map(doc => doc.data());

      const uniqueSources = [...new Set(articles.map(article => article.source).filter(Boolean))];
      setSources(uniqueSources);
    };

    fetchSources();
  }, []);

  return (
    <div>
      <h1>Sources utilisées</h1>
      <ul>
        {sources.length === 0 ? (
          <li>Aucune source trouvée</li>
        ) : (
          sources.map((src, idx) => (
            <li key={idx}>
              <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Sources;
