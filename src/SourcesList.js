import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Summary from './Summary';
import ActusGame from './ActusGame';
import WorldMap from './WorldMap';
import Dossiers from './Dossiers';
import SourcesList from './SourcesList';
import Navbar from './Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/jeu" element={<ActusGame />} />
          <Route path="/carte" element={<WorldMap />} />
          <Route path="/dossiers" element={<Dossiers />} />
          <Route path="/sources" element={<SourcesList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
