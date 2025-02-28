import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';
import sbttn from '../assets/sbttn.svg';
import dbttn from '../assets/dbttn.svg';
import abttn from '../assets/abttn.svg';

const AdminPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-panel">
      <div className="content-container">
        <div className="dashboard-buttons">
          <div className="dashboard-button" onClick={() => navigate('/admin/students')}>
            <img src={sbttn} alt="Студенты" />
          </div>
          <div className="dashboard-button" onClick={() => navigate('/admin/dormitories')}>
            <img src={dbttn} alt="Общежития" />
          </div>
          <div className="dashboard-button" onClick={() => navigate('/admin/applications')}>
            <img src={abttn} alt="Заявки" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
