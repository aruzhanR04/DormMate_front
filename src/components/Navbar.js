import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ username }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item"><Link to="/login">Login</Link></li>
        <li className="nav-item"><Link to="/application">Подать заявку</Link></li>
      </ul>
      {/* {username && (
        <div className="user-profile">
          <img src="../assets/user-icon.png" alt="User Icon" className="user-icon" />
          <span className="username">{username}</span>
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
