import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';
import bellIcon from '../assets/bell.png'; 

const Navbar = ({ isAuthenticated, userRole, hasNewNotification }) => {
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
        {isAuthenticated && userRole === 'student' && (
          <li className="nav-item">
            <div className="notification-bell">
              <img src={bellIcon} alt="Notifications" />
              {hasNewNotification && <span className="notification-dot"></span>}
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
