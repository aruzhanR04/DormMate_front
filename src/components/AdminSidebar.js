import React from 'react';
import { useNavigate } from 'react-router-dom';
import sicon from '../assets/sicon2.png';
import dicon from '../assets/dicon2.png';
import aicon from '../assets/aicon2.png';
import '../styles/AdminSidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    return (
      <nav className="sidebar">
        <ul>
          <li onClick={() => navigate('/admin/students')}>
            <img src={sicon} alt="Студенты" className="nav-icon" /> <span>Студенты</span>
          </li>
          <li onClick={() => navigate('/admin/dormitories')}>
            <img src={dicon} alt="Общежития" className="nav-icon" /> <span>Общежития</span>
          </li>
          <li onClick={() => navigate('/admin/applications')}>
            <img src={aicon} alt="Заявки" className="nav-icon" /> <span>Заявки</span>
          </li>
        </ul>
      </nav>
    );
  };
  
export default AdminSidebar;
