import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <Link to="/" className="nav-button">Résumé</Link>
      <Link to="/jeu" className="nav-button">Jeu</Link>
      <Link to="/dossiers" className="nav-button">Dossiers</Link>
      <Link to="/carte" className="nav-button">Carte</Link>
      <Link to="/sources" className="nav-button">Sources</Link>
    </nav>
  );
}

export default Navbar;
