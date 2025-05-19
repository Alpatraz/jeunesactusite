import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Résumé
          </Link>
          <Link
            to="/jeu"
            className={location.pathname === '/jeu' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Jeu
          </Link>
          <Link
            to="/dossiers"
            className={location.pathname === '/dossiers' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Dossiers
          </Link>
          <Link
            to="/carte"
            className={location.pathname === '/carte' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Carte
          </Link>
          <Link
            to="/sources"
            className={location.pathname === '/sources' ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            Sources
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
