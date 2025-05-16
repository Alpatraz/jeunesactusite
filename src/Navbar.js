import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink exact="true" to="/" activeclassname="active">Résumé</NavLink>
      <NavLink to="/jeu" activeclassname="active">Jeux</NavLink>
      <NavLink to="/carte" activeclassname="active">Carte du monde</NavLink>
      <NavLink to="/dossiers" activeclassname="active">Dossiers</NavLink>
    </nav>
  );
};

export default Navbar;
