import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { features } from './config/features';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const close = () => setMenuOpen(false);
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span role="img" aria-label="journal" className="logo-icon">📰</span>
          JEUNES <span>ACTU</span>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {/* Résumé */}
          <Link to="/" className={isActive('/')} onClick={close}>
            Résumé
          </Link>

          {/* Jeu */}
          {features.jeu && (
            <Link to="/jeu" className={isActive('/jeu')} onClick={close}>
              Jeu
            </Link>
          )}

          {/* Dossiers */}
          {features.dossiers && (
            <Link to="/dossiers" className={isActive('/dossiers')} onClick={close}>
              Dossiers
            </Link>
          )}

          {/* Carte */}
          {features.carte && (
            <Link to="/carte" className={isActive('/carte')} onClick={close}>
              Carte
            </Link>
          )}

          {/* Sources */}
          {features.sources && (
            <Link to="/sources" className={isActive('/sources')} onClick={close}>
              Sources
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
