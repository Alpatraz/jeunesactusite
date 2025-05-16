import React from 'react';

const NewsList = ({ news }) => {
  return (
    <div>
      <h2>Latest News</h2>
      <ul>
        {news.length > 0 ? (
          news.map((item, index) => (
            <li key={index}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {/* Affichez d'autres informations que vous souhaitez, comme un lien vers l'article */}
            </li>
          ))
        ) : (
          <p>No news available.</p>
        )}
      </ul>
    </div>
  );
};

export default NewsList;
