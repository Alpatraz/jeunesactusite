import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { features } from './config/features';
import Summary from './Summary';
import ActusGame from './ActusGame';
import Dossiers from './Dossiers';
import SourcesList from './Sources';
import MapPage from './MapPage';
import Navbar from './Navbar';
import './App.css';

// Wrapper pour protéger les routes
const Protected = ({ enabled, children }) =>
  enabled ? children : <Navigate to="/" replace />;

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Summary />} />
        <Route path="/jeu" element={
          <Protected enabled={features.jeu}><ActusGame /></Protected>
        } />
        <Route path="/dossiers" element={
          <Protected enabled={features.dossiers}><Dossiers /></Protected>
        } />
        <Route path="/carte" element={
          <Protected enabled={features.carte}><MapPage /></Protected>
        } />
        <Route path="/sources" element={
          <Protected enabled={features.sources}><SourcesList /></Protected>
        } />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
