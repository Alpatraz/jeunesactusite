
import React from "react";
import Filters from "./components/Filters";
import NewsCard from "./components/NewsCard";

const HomePage = () => {
  return (
    <div>
      <h1>Bienvenue sur Jeunes Actu</h1>
      <Filters />
      <div className="news-list">
        {/* Liste d'articles (temporaire) */}
        <NewsCard />
        <NewsCard />
      </div>
    </div>
  );
};

export default HomePage;
    