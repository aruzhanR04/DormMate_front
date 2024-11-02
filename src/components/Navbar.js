import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ username }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item"><Link to="/login">Login</Link></li>
        <li className="nav-item"><Link to="/application">Подать заявку</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
