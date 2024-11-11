import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = ({ isAuthenticated, userRole }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            {userRole === 'student' && (
              <>
                <li className="nav-item">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/create-application">Подать заявку</Link>
                </li>
              </>
            )}
            {userRole === 'admin' && (
              <li className="nav-item">
                <Link to="/admin">Admin Panel</Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
