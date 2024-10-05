import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo"> 
        <img src="../assets/logo.png" alt="Logo" />
      </div>
      <ul className="nav-list">
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item"><Link to="/login">Login</Link></li>
        <li className="nav-item"><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
