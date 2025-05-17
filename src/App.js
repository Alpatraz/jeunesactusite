import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Summary from './Summary';
import ActusGame from './ActusGame';
import Dossiers from './Dossiers';
import SourcesList from './Sources';
import MapPage from './MapPage';
import Navbar from './Navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Summary />} />
        <Route path="/jeu" element={<ActusGame />} />
        <Route path="/dossiers" element={<Dossiers />} />
        <Route path="/sources" element={<SourcesList />} />
        <Route path="/carte" element={<MapPage />} />
      </Routes>
    </div>
  );
}

export default App;
