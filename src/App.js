import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Summary from './Summary';
import ActusGame from './ActusGame';
import WorldMap from './WorldMap';
import Dossiers from './Dossiers';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      {/* Menu global */}
      <Navbar />

      {/* Contenu des pages */}
      <Routes>
        <Route path="/" element={<Summary />} />
        <Route path="/jeu" element={<ActusGame />} />
        <Route path="/carte" element={<WorldMap />} />
        <Route path="/dossiers" element={<Dossiers />} />
      </Routes>
    </div>
  );
}

export default App;
